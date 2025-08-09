// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingSystem {
    address public admin;

    constructor() {
        admin = msg.sender;
    }

    // --------------------
    // STRUCTS
    // --------------------

    enum PollType { Committee, General }

    struct Poll {
        uint id;
        string title;
        PollType pollType;
        bool isInitiated;
        bool isStarted;
        bool isCompleted;
        uint startTime;
        uint endTime;
        uint candidateJoinStart;
        uint candidateJoinEnd;
        string[] options; // For general polls
        mapping(string => bool) hasVoted;
        mapping(string => uint) votes; // option => votes
        mapping(string => uint) votedOption; // roll => option index
        string[] voters;
        string[] candidates; // For committee polls
    }

    uint public pollCount;
    mapping(uint => Poll) public polls;
    mapping(string => bool) public isCommitteeMember;
    string[] public currentCommitteeMembers;

    // --------------------
    // DURATION VARIABLES
    // --------------------

    uint public candidateJoinDuration = 1 days;
    uint public candidateJoinExtension = 1 days;
    uint public votingDuration = 2 days;

    // --------------------
    // EVENTS
    // --------------------

    event PollInitiated(uint pollId, PollType pollType);
    event CandidateJoined(uint pollId, string rollNumber);
    event PollStarted(uint pollId);
    event Voted(uint pollId, string rollNumber, string option);
    event PollCompleted(uint pollId);
    event CommitteeUpdated(string[] newMembers);

    // FoodByte Events
    event VotedAndRewarded(string rollNumber, uint pollId, string pollType);
    event CandidateRegistered(string rollNumber, uint pollId);
    event CommitteeMemberElected(string rollNumber, uint pollId);
    event VoteMissed(string rollNumber, uint pollId);
    event CandidateNotParticipated(string rollNumber, uint pollId);

    // --------------------
    // MODIFIERS
    // --------------------

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    // Mapping to simulate rollNumber-to-address (for committee members)
    mapping(address => bool) public isCommitteeMemberByAddress;

    // --------------------
    // API-CONTROLLED UPDATABLE TIMES
    // --------------------

    function updateDurations(
        uint _candidateJoinDuration,
        uint _candidateJoinExtension,
        uint _votingDuration
    ) external onlyAdmin {
        candidateJoinDuration = _candidateJoinDuration;
        candidateJoinExtension = _candidateJoinExtension;
        votingDuration = _votingDuration;
    }

    // --------------------
    // POLL FUNCTIONS
    // --------------------

    function initiateCommitteePoll() external onlyAdmin {
        pollCount++;
        Poll storage p = polls[pollCount];
        p.id = pollCount;
        p.pollType = PollType.Committee;
        p.isInitiated = true;
        p.title = "Mess Committee Election";
        p.candidateJoinStart = block.timestamp;
        p.candidateJoinEnd = block.timestamp + candidateJoinDuration;

        emit PollInitiated(pollCount, PollType.Committee);
    }

    function createGeneralPoll(
        string memory title,
        string[] memory options,
        uint duration
    ) external onlyAdmin {
        pollCount++;
        Poll storage p = polls[pollCount];
        p.id = pollCount;
        p.title = title;
        p.pollType = PollType.General;
        p.options = options;
        p.startTime = block.timestamp;
        p.endTime = block.timestamp + duration;
        p.isInitiated = true;
        p.isStarted = true;

        emit PollInitiated(pollCount, PollType.General);
        emit PollStarted(pollCount);
    }

    function joinCandidate(uint pollId, string memory rollNumber) external {
        Poll storage p = polls[pollId];
        require(p.pollType == PollType.Committee, "Only for committee poll");
        require(block.timestamp >= p.candidateJoinStart && block.timestamp <= p.candidateJoinEnd, "Not in candidate join window");

        p.candidates.push(rollNumber);
        emit CandidateJoined(pollId, rollNumber);
        emit CandidateRegistered(rollNumber, pollId);
    }

    function startVotingPhase(uint pollId) external onlyAdmin {
        Poll storage p = polls[pollId];
        require(p.candidates.length >= 2, "Not enough candidates");

        p.isStarted = true;
        p.startTime = block.timestamp;
        p.endTime = block.timestamp + votingDuration;

        emit PollStarted(pollId);
    }

    function vote(uint pollId, string memory rollNumber, uint optionIndex) external {
        Poll storage p = polls[pollId];
        require(p.isStarted, "Voting not started");
        require(block.timestamp >= p.startTime && block.timestamp <= p.endTime, "Voting closed");
        require(!p.hasVoted[rollNumber], "Already voted");

        string memory selected;

        if (p.pollType == PollType.General) {
            require(optionIndex < p.options.length, "Invalid option index");
            selected = p.options[optionIndex];
        } else {
            require(optionIndex < p.candidates.length, "Invalid candidate index");
            selected = p.candidates[optionIndex];
        }

        p.hasVoted[rollNumber] = true;
        p.votedOption[rollNumber] = optionIndex;
        p.votes[selected]++;
        p.voters.push(rollNumber);

        emit Voted(pollId, rollNumber, selected);
        emit VotedAndRewarded(rollNumber, pollId, p.pollType == PollType.Committee ? "Committee" : "General");
    }


    function completePoll(uint pollId) external onlyAdmin {
        Poll storage p = polls[pollId];
        require(!p.isCompleted && block.timestamp > p.endTime, "Cannot complete yet");

        p.isCompleted = true;
        emit PollCompleted(pollId);

        if (p.pollType == PollType.Committee) {
            updateCommitteeMembers(pollId);
        }
    }

    function updateCommitteeMembers(uint pollId) internal {
        // Clear old members
        for (uint i = 0; i < currentCommitteeMembers.length; i++) {
            isCommitteeMember[currentCommitteeMembers[i]] = false;
        }
        delete currentCommitteeMembers;

        // Get top 5 from this poll
        Poll storage p = polls[pollId];
        string[] memory top = getTopCandidates(pollId);
        for (uint i = 0; i < top.length && i < 5; i++) {
            isCommitteeMember[top[i]] = true;
            currentCommitteeMembers.push(top[i]);
            emit CommitteeMemberElected(top[i], pollId);
        }

        emit CommitteeUpdated(currentCommitteeMembers);
    }

    // --------------------
    // UTILITY FUNCTIONS
    // --------------------

    function getVotedCandidate(uint pollId, string memory rollNumber) external view returns (string memory) {
        Poll storage p = polls[pollId];
        require(p.hasVoted[rollNumber], "Student hasn't voted");

        if (p.pollType == PollType.General) {
            return p.options[p.votedOption[rollNumber]];
        } else {
            return p.candidates[p.votedOption[rollNumber]];
        }
    }

    function getTopCandidates(uint pollId) public view returns (string[] memory) {
        Poll storage p = polls[pollId];
        return p.candidates; // Replace with actual sorting logic if needed
    }

    function getPollVoters(uint pollId) external view returns (string[] memory) {
        return polls[pollId].voters;
    }

    function getOptions(uint pollId) external view returns (string[] memory) {
        return polls[pollId].options;
    }

    function getCandidates(uint pollId) external view returns (string[] memory) {
        return polls[pollId].candidates;
    }

    function dropIfNoCandidates(uint pollId) external onlyAdmin {
        Poll storage p = polls[pollId];
        require(p.pollType == PollType.Committee, "Not a committee poll");
        require(block.timestamp > p.candidateJoinEnd, "Join period not over");

        if (p.candidates.length == 0) {
            p.isCompleted = true;
            emit PollCompleted(pollId);
        }
    }


    function handleLowCandidateCount(uint pollId) external onlyAdmin {
        Poll storage p = polls[pollId];
        require(p.pollType == PollType.Committee, "Not a committee poll");
        require(!p.isCompleted, "Poll already completed");
        require(block.timestamp > p.candidateJoinEnd, "Join period not over");

        if (p.candidates.length < 3 && p.candidateJoinEnd == p.candidateJoinStart + candidateJoinDuration) {
            p.candidateJoinEnd += candidateJoinExtension;
        } else if (block.timestamp > p.candidateJoinEnd && p.candidates.length < 5) {
            p.isCompleted = true;
            emit PollCompleted(pollId);
        }
    }



}
