import QRCode from 'qrcode';

const generateStudentQR = async (rollno) => {
    try {
        // Create a JSON object with static student data
        const studentData = JSON.stringify({
          type: "student",
          rollNo: rollno
        });
    
        // Generate QR code from the student data
        const qrCodeDataURL = await QRCode.toDataURL(studentData);
        return qrCodeDataURL;
    } catch (error) {
        throw new Error("Error generating student QR code");
    }
};


const generateMealTokenQR = async (token) => {
    try {
        const tokenData = JSON.stringify({
            type: "token",
            tokenId: token._id, 
            name: token.name, 
            totalTokens: token.totalTokens 
        });

        const qrCodeDataURL = await QRCode.toDataURL(tokenData);
        return qrCodeDataURL;
    } catch (error) {
        throw new Error("Error generating meal token QR code");
    }
};


export {
    generateStudentQR,
    generateMealTokenQR,
};
