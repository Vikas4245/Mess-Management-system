// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ComplaintSystem {
    address public admin;
    address public fineRecipient;
    uint256 public fineAmount = 0.001 ether;

    uint256 public defaultVotingDuration = 2 days;
    uint256 public defaultResolutionTime = 15 days;

    struct Complaint {
        uint id;
        string category;
        string description;
        uint timestamp;
        string status; // "Open", "Resolved", "Fake", "Unresolved Penalized"
        uint voteDeadline;
        uint agreeVotes;
        uint disagreeVotes;
        bool votingCompleted;
        mapping(string => bool) hasVoted;
        bool fineDeducted;
        uint count;
    }

    Complaint[] public complaints;

    event ComplaintAdded(uint id, string category, string description, uint timestamp, string status);
    event VoteCast(uint complaintId, string rollNumber, bool agree);
    event ComplaintResolved(uint id);
    event ComplaintRemoved(uint id);
    event FineDeducted(uint id, uint256 amount);
    event RewardGiven(string rollNumber, string token); // For MongoDB-managed FoodByte rewards

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor(address _fineRecipient) {
        admin = msg.sender;
        fineRecipient = _fineRecipient;
    }

    function setVotingDuration(uint256 _durationInDays) external onlyAdmin {
        require(_durationInDays >= 2, "Minimum 2 days required");
        defaultVotingDuration = _durationInDays * 1 days;
    }

    function setResolutionTime(uint256 _days) external onlyAdmin {
        defaultResolutionTime = _days * 1 days;
    }

    function addComplaint(
        string memory _category,
        string memory _description
    ) public onlyAdmin {
        uint complaintId = complaints.length;
        Complaint storage newComplaint = complaints.push();
        newComplaint.id = complaintId;
        newComplaint.category = _category;
        newComplaint.description = _description;
        newComplaint.timestamp = block.timestamp;
        newComplaint.status = "Open";
        newComplaint.fineDeducted = false;
        newComplaint.count = 1;

        emit ComplaintAdded(complaintId, _category, _description, block.timestamp, "Open");
    }

    function incrementComplaintCount(uint _id) public onlyAdmin {
        require(_id < complaints.length, "Invalid complaint ID");
        complaints[_id].count++;
    }


    struct ComplaintView {
        uint id;
        string category;
        string description;
        uint timestamp;
        string status;
        uint voteDeadline;
        uint agreeVotes;
        uint disagreeVotes;
        bool votingCompleted;
        uint count;
    }

    function getAllComplaints() public view returns (ComplaintView[] memory) {
        ComplaintView[] memory list = new ComplaintView[](complaints.length);
        for (uint i = 0; i < complaints.length; i++) {
            Complaint storage c = complaints[i];
            list[i] = ComplaintView(
                c.id,
                c.category,
                c.description,
                c.timestamp,
                c.status,
                c.voteDeadline,
                c.agreeVotes,
                c.disagreeVotes,
                c.votingCompleted,
                c.count
            );
        }
        return list;
    }

    function getComplaintsByStatus(string memory _status) public view returns (ComplaintView[] memory) {
        uint count = 0;

        for (uint i = 0; i < complaints.length; i++) {
            if (keccak256(bytes(complaints[i].status)) == keccak256(bytes(_status))) {
                count++;
            }
        }

        ComplaintView[] memory filtered = new ComplaintView[](count);
        uint index = 0;

        for (uint i = 0; i < complaints.length; i++) {
            if (keccak256(bytes(complaints[i].status)) == keccak256(bytes(_status))) {
                Complaint storage c = complaints[i];
                filtered[index] = ComplaintView(
                    c.id,
                    c.category,
                    c.description,
                    c.timestamp,
                    c.status,
                    c.voteDeadline,
                    c.agreeVotes,
                    c.disagreeVotes,
                    c.votingCompleted,
                    c.count
                );
                index++;
            }
        }

        return filtered;
    }

    function getComplaintsByCategory(string memory _category) public view returns (ComplaintView[] memory) {
        uint count = 0;

        for (uint i = 0; i < complaints.length; i++) {
            if (keccak256(bytes(complaints[i].category)) == keccak256(bytes(_category))) {
                count++;
            }
        }

        ComplaintView[] memory filtered = new ComplaintView[](count);
        uint index = 0;

        for (uint i = 0; i < complaints.length; i++) {
            if (keccak256(bytes(complaints[i].category)) == keccak256(bytes(_category))) {
                Complaint storage c = complaints[i];
                filtered[index] = ComplaintView(
                    c.id,
                    c.category,
                    c.description,
                    c.timestamp,
                    c.status,
                    c.voteDeadline,
                    c.agreeVotes,
                    c.disagreeVotes,
                    c.votingCompleted,
                    c.count
                );
                index++;
            }
        }

        return filtered;
    }

    function getComplaintsByStatusAndCategory(string memory _status, string memory _category) public view returns (ComplaintView[] memory) {
        uint count = 0;

        for (uint i = 0; i < complaints.length; i++) {
            if (
                keccak256(bytes(complaints[i].status)) == keccak256(bytes(_status)) &&
                keccak256(bytes(complaints[i].category)) == keccak256(bytes(_category))
            ) {
                count++;
            }
        }

        ComplaintView[] memory filtered = new ComplaintView[](count);
        uint index = 0;

        for (uint i = 0; i < complaints.length; i++) {
            if (
                keccak256(bytes(complaints[i].status)) == keccak256(bytes(_status)) &&
                keccak256(bytes(complaints[i].category)) == keccak256(bytes(_category))
            ) {
                Complaint storage c = complaints[i];
                filtered[index] = ComplaintView(
                    c.id,
                    c.category,
                    c.description,
                    c.timestamp,
                    c.status,
                    c.voteDeadline,
                    c.agreeVotes,
                    c.disagreeVotes,
                    c.votingCompleted,
                    c.count
                );
                index++;
            }
        }

        return filtered;
    }


    function startVoting(uint _id) public onlyAdmin {
        require(_id < complaints.length, "Invalid complaint");
        Complaint storage c = complaints[_id];
        require(!c.votingCompleted, "Voting already finalized");
        require(c.voteDeadline == 0, "Voting already started");

        c.voteDeadline = block.timestamp + defaultVotingDuration;
    }

    function voteOnComplaint(uint _id, string memory _rollNumber, bool _agree) public {
        require(_id < complaints.length, "Invalid complaint");
        Complaint storage c = complaints[_id];
        require(c.voteDeadline != 0 && block.timestamp <= c.voteDeadline, "Voting not active");
        require(!c.hasVoted[_rollNumber], "Already voted");

        c.hasVoted[_rollNumber] = true;

        if (_agree) c.agreeVotes++;
        else c.disagreeVotes++;

        emit VoteCast(_id, _rollNumber, _agree);
        emit RewardGiven(_rollNumber, "FoodByte");
    }

    function finalizeVoting(uint _id) public onlyAdmin {
        require(_id < complaints.length, "Invalid complaint");
        Complaint storage c = complaints[_id];
        require(block.timestamp > c.voteDeadline, "Voting ongoing");
        require(!c.votingCompleted, "Already finalized");

        c.votingCompleted = true;

        if (c.disagreeVotes > c.agreeVotes) {
            c.status = "Fake";
            emit ComplaintRemoved(_id);
        }
    }

    function resolveComplaint(uint _id) public onlyAdmin {
        require(_id < complaints.length, "Invalid complaint");
        Complaint storage c = complaints[_id];
        require(keccak256(bytes(c.status)) == keccak256(bytes("Open")), "Not open");

        c.status = "Resolved";
        emit ComplaintResolved(_id);
    }

    function checkAndDeductFines() public onlyAdmin {
        for (uint i = 0; i < complaints.length; i++) {
            Complaint storage c = complaints[i];

            if (
                keccak256(bytes(c.status)) == keccak256(bytes("Open")) &&
                !c.fineDeducted &&
                block.timestamp > c.timestamp + defaultResolutionTime
            ) {
                c.status = "Unresolved Penalized";
                c.fineDeducted = true;

                if (address(this).balance >= fineAmount) {
                    payable(fineRecipient).transfer(fineAmount);
                    emit FineDeducted(c.id, fineAmount);
                } else {
                    emit FineDeducted(c.id, 0);
                }
            }
        }
    }

    function hasStudentVoted(uint _id, string memory _rollNumber) public view returns (bool) {
        require(_id < complaints.length, "Invalid complaint");
        return complaints[_id].hasVoted[_rollNumber];
    }

    function getComplaintCount() public view returns (uint) {
        return complaints.length;
    }

    receive() external payable {}

    fallback() external payable {}
}
