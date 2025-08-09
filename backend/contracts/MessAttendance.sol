// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MessAttendance {

    // Struct for student attendance
    struct StudentAttendance {
        uint256 morningTimestamp;
        uint256 afternoonTimestamp;
        uint256 eveningTimestamp;
    }

    // Struct for meal token
    struct MealToken {
        uint256 tokenId;
        uint256 numPeople;
        uint256 redeemedCount;
        bool isFullyRedeemed;
        uint256 purchaseTimestamp;
    }

    // Struct for meal attendance tracking
    struct MealAttendance {
        uint256 morningCount;
        uint256 afternoonCount;
        uint256 eveningCount;
    }

    // Mappings for attendance, tokens, and meal attendance tracking
    mapping(string => StudentAttendance) public attendanceRecords; // rollNo => attendance
    mapping(uint256 => MealToken) public mealTokens;               // tokenId => mealToken
    mapping(bytes32 => MealAttendance) public mealAttendanceByDate; // dateHash => mealAttendance

    uint256 private tokenCounter = 1; // Token ID generator

    // Events
    event AttendanceRecorded(string indexed rollNo, string session, uint256 timestamp);
    event TokenPurchased(uint256 indexed tokenId, uint256 numPeople, uint256 purchaseTimestamp);
    event TokenRedeemed(uint256 indexed tokenId, uint256 redeemedCount, bool isFullyRedeemed);

    // Function to record attendance using roll number
    function recordAttendance(string memory rollNo, string memory session, bytes32 dateHash) public {
        StudentAttendance storage attendance = attendanceRecords[rollNo];
        MealAttendance storage mealAttendance = mealAttendanceByDate[dateHash];

        if (keccak256(bytes(session)) == keccak256("morning")) {
            require(attendance.morningTimestamp == 0, "Morning attendance already recorded");
            attendance.morningTimestamp = block.timestamp;
            mealAttendance.morningCount++;
        } else if (keccak256(bytes(session)) == keccak256("afternoon")) {
            require(attendance.afternoonTimestamp == 0, "Afternoon attendance already recorded");
            attendance.afternoonTimestamp = block.timestamp;
            mealAttendance.afternoonCount++;
        } else if (keccak256(bytes(session)) == keccak256("evening")) {
            require(attendance.eveningTimestamp == 0, "Evening attendance already recorded");
            attendance.eveningTimestamp = block.timestamp;
            mealAttendance.eveningCount++;
        } else {
            revert("Invalid session");
        }

        emit AttendanceRecorded(rollNo, session, block.timestamp);
    }

    // Function to purchase a meal token
    function purchaseToken(uint256 numPeople) public returns (uint256) {
        mealTokens[tokenCounter] = MealToken({
            tokenId: tokenCounter,
            numPeople: numPeople,
            redeemedCount: 0,
            isFullyRedeemed: false,
            purchaseTimestamp: block.timestamp
        });

        emit TokenPurchased(tokenCounter, numPeople, block.timestamp); // Keep this for record
        tokenCounter++;

        return tokenCounter - 1; // Return the purchased token ID
    }


    // Function to redeem a meal token using token ID
    function redeemToken(uint256 tokenId) public {
        MealToken storage token = mealTokens[tokenId];
        require(!token.isFullyRedeemed, "Token is fully redeemed");
        require(token.redeemedCount < token.numPeople, "Redemption limit reached");

        token.redeemedCount++;

        if (token.redeemedCount == token.numPeople) {
            token.isFullyRedeemed = true;
        }

        emit TokenRedeemed(tokenId, token.redeemedCount, token.isFullyRedeemed);
    }

    // Function to get meal attendance counts for a specific date
    function getMealAttendance(bytes32 dateHash) public view returns (MealAttendance memory) {
        return mealAttendanceByDate[dateHash];
    }
}
