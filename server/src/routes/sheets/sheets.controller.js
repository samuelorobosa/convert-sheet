const xlsx = require('xlsx');
const {Helpers} = require("../../utils/Helpers");
const { v4: uuidv4 } = require('uuid');
const {unlink,writeFileSync, existsSync, mkdirSync} = require("fs");
const {join} = require("path");

const MONTHDATE = 1;
const DATEMONTH = 2;
function welcomeFunc(req, res){
    res.status(200).send("Welcome to the server");
}

async function uploadFile(req, res) {
    try {
        const file = req.file;
        const dateColumn = req.body.dateFieldName;
        const firstIdentifier = req.body.identifierName1;
        const secondIdentifier = req.body.identifierName2;
        const dateType = req.body.dateType;
        const workbook = xlsx.readFile(file.path);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(worksheet, { header: 2});


        //Get the birthdays & the names of the participants
        const finalChunk = data.map((profile)=>{
            const fullName = `${profile[firstIdentifier]} ${profile[secondIdentifier]}`;
            const birthDay = `${profile[dateColumn]}`;
            return{fullName, birthDay}
        })

        // Create ICS file
        const iCSEvents = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Example Corp//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
${finalChunk.map((chunk) => {
            const dateInitializer = new Date();
            const fullYear = dateInitializer.getFullYear()
            const currentMonth = dateInitializer.getMonth();
            const currentDay = dateInitializer.getDate();
            let dateArr = chunk.birthDay.split('/');
            let month = getMonth(dateArr, dateType)
            let day = getDay(dateArr, dateType)
            return `
BEGIN:VEVENT
UID:${uuidv4(undefined, undefined, undefined)}
DTSTAMP:${Helpers.stringToUTC(fullYear, currentMonth + 1, currentDay)}
DTSTART:${Helpers.stringToUTC(fullYear, month, day)}
DURATION:PT5M
SUMMARY:${chunk.fullName}
DESCRIPTION:Today is ${chunk.fullName}'s birthday.
BEGIN:VALARM
TRIGGER:-PT5M
ACTION:DISPLAY
DESCRIPTION:Reminder
END:VALARM
END:VEVENT`;
        }).join('')}
END:VCALENDAR`

        // Save file to folder
        const ICSFIlePath = join(__dirname, '..', '..', '..', 'conversions');
        if (!existsSync(ICSFIlePath)){
            mkdirSync(ICSFIlePath);
        }

        writeFileSync(
            join(ICSFIlePath, `${file.filename}.ics`),
            iCSEvents,
            "UTF8"
        )

        // Clean up the temporary file
        unlink(file.path, (err) => {
            if (err) {
                return res.status(500).json({message: "Error handling file data"})
            }
        });

        return res.json({
            message: 'File conversion successful',
            fileName: file.filename
        });

    } catch (err){
        return res.status(500).json({message: "Error handling file data"})
    }
}

function getMonth(arr, type){
    const month =  (+type === MONTHDATE) ? arr[0] : arr[1];
    return Number(month);
}

function getDay(arr, type){
    const day = (+type === DATEMONTH) ? arr[0] : arr[1];
    return Number(day);
}
module.exports ={
    uploadFile,
    welcomeFunc,
}