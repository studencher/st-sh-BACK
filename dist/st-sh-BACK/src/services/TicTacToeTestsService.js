"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicTacToeTestsService = void 0;
const fs = __importStar(require("fs"));
const Logger_1 = __importDefault(require("../helpers/Logger"));
class TicTacToeTestsService {
    constructor(logger, dotNetProjectTestsService) {
        this.logger = logger;
        this.dotNetProjectTestsService = dotNetProjectTestsService;
    }
    static getUsingJsonPartial() { return "Newtonsoft.Json"; }
    static getOldProgramMainSignature() { return "static int Main"; }
    static getNewProgramMainSignature() { return "static int TaskMain"; }
    static getGetUserInputRegex() {
        return /static string getUserInput\(\)[^{]*{[^}]*}/g;
    }
    static getPrintBoardRegex() {
        return /static void printBoard\(char\[\] board\)\s*[^{]*\{[^}]*\}/g;
    }
    static getGetInitializedBoardRegex() {
        return /static char\[\]\[\] getInitializedBoard\(\)[^{]*{[^}]*}/g;
    }
    static getProgramClassRegex() {
        return /^[\s\n]*class\s+Program\s*({\s*)?/m;
    }
    static getGetInitializedTurnCounterRegex() {
        return /static int getInitializedTurnCounter\(\)[^{]*{[^}]*}/g;
    }
    static getNewGetUserInputForAutoTest() {
        return `static string getUserInput(){
        string charRange = "abcZ1234567890!%+";
        Random rnd = new Random();
        int index = rnd.Next(charRange.Length);
        return charRange[index].ToString();
    }`;
    }
    static getNewPrintBoardForShadowTest() {
        return `static void printBoard(char[] board){
                if(TicTacToeShadowTests.isTurnEnded)
                    TicTacToeShadowTests.verifyCurrentBoard(board);
                TicTacToeShadowTests.isTurnEnded = false;
            }`;
    }
    static getNewGetUserInputForShadowTest() {
        return `static string getUserInput(){
        int currentInputIndex = TicTacToeShadowTests.inputTrialsCounter - 1;    
        string currentInput = TicTacToeShadowTests.userInputTrials[currentInputIndex];   
        if(TicTacToeShadowTests.inputTrialsCounter % 2 == 0){
            TicTacToeShadowTests.setExpectedBoardAndHandleTurnCounter();
            TicTacToeShadowTests.isTurnEnded = true; 
        }
        TicTacToeShadowTests.inputTrialsCounter++;
        return currentInput;
    }`;
    }
    static getNewGetInitializedBoardFunction() {
        return `static char[] getInitializedBoard(string[] args){
            char[] defaultPositions;
            defaultPositions = new char[9];

            for (int i = 0; i < defaultPositions.Length; i++)
                defaultPositions[i] = '-';
            TicTacToeInput inputData = args.Length > 0 ? JsonConvert.DeserializeObject<TicTacToeInput>(args[0]) : new TicTacToeInput(defaultPositions, 0);    
            return inputData.getPositions();      
        }`;
    }
    static getNewGetInitializedTurnCounterFunction() {
        return `static int getInitializedTurnCounter(string[] args){
            char[] defaultPositions;
            defaultPositions = new char[9];

            for (int i = 0; i < defaultPositions.Length; i++)
                defaultPositions[i] = '-';
            TicTacToeInput inputData = args.Length > 0 ? JsonConvert.DeserializeObject<TicTacToeInput>(args[0]) : new TicTacToeInput(defaultPositions, 0);    
            return inputData.getTurnCounter();
        }`;
    }
    static getNewMainHelpersClassesForAutoTest() {
        return `class Program
        {
        
        static void Main(string[] args){
            TicTacToeTests.run();
        }

                
        public class TicTacToeInput{
            [JsonProperty]
            private char[] board { get; set; }
            [JsonProperty]
            private int turnCounter { get; set; }

            public TicTacToeInput (char[] board, int turnCounter) {
                this.board = board;
                this.turnCounter = turnCounter;
            }

            public int getTurnCounter(){ return this.turnCounter;}
            public char[] getPositions(){return this.board ;}
        }
        class TicTacToeTests{
            
            static void Log(string log)
            {
                string logFilePath = Path.Combine(Directory.GetCurrentDirectory(), "program-logs.txt");
                using (StreamWriter sw = File.AppendText(logFilePath))
                {
                   sw.WriteLine($"{log}");
                }
            }
            public static void run(){
                Log("Starting Tic Tac Toe Tests...");
                testRandomMoves();
                testComputerMoves();
                Log("Ended Tic Tac Toe Tests.");
            }

            static void testRandomMoves(){
            int sessionResult;
            int userWinningsCounter = 0, computerWinningsCounter = 0, drawsCounter = 0, unknownFailuresCounter = 0;
            try{
                for(int i = 0; i < 1000; i++ ){
                sessionResult = TaskMain(new string[0]);
                if(sessionResult == -1)
                {
                    unknownFailuresCounter++;
                }
                else if(sessionResult == 0){
                    drawsCounter++;
                }
                else if (sessionResult == 1){
                    computerWinningsCounter++;
                }else if(sessionResult == 2){
                    userWinningsCounter++;
                }
            }
            if(userWinningsCounter > 0)
                Log($"Failure: The user won {userWinningsCounter} games");
            if(unknownFailuresCounter >0)
                Log($"Failure: Uknown failures in {unknownFailuresCounter} games");

            }catch(Exception err){
                Log("Error - " + err.Message);
            }
            }
            static void testComputerMoves(){
                TicTacToeInput[] compuerShouldWinInputs = new TicTacToeInput[]{
                                new TicTacToeInput(new char[] { 'O', 'X', 'X',
                                                                'O', '-', 'X',
                                                                '-', '-', '-' }, 5),
                                new TicTacToeInput(new char[] { 'O', 'O', '-',
                                                                'X', 'X', '-',
                                                                '-', 'X', '-' }, 5),
                                new TicTacToeInput(new char[] { 'O', 'X', '-',
                                                                'X', 'O', '-',
                                                                'X', '-', '-' }, 5) ,
                                new TicTacToeInput(new char[] { 'X', 'O', '-',
                                                                'X', 'O', '-',
                                                                '-', '-', 'X' }, 5) ,
                                new TicTacToeInput(new char[] { 'O', '0', 'X',
                                                                'X', 'O', 'X',
                                                                'X', '-', '-' }, 5),
                                new TicTacToeInput(new char[] { 'X', '-', '-',
                                                                '-', 'O', '-',
                                                                '-', '-', 'X' }, 5),
                                new TicTacToeInput(new char[] { 'X', 'O', '-',
                                                                '-', 'O', '-',
                                                                '-', '-', 'X' }, 5),
                                new TicTacToeInput(new char[] { '-', '-', 'X',
                                                                '-', 'O', '-',
                                                                'X', '-', '-' }, 5),
                                new TicTacToeInput(new char[] { 'O', '-', '-',
                                                                '-', 'X', '-',
                                                                'X', '-', 'O' }, 5),
                                new TicTacToeInput(new char[] { '-', 'O', 'X',
                                                                'X', 'O', 'X',
                                                                'O', '-', '-' }, 5)
                            };
                
                for(int i = 0; i < compuerShouldWinInputs.Length; i++){
                    TicTacToeInput testInput = compuerShouldWinInputs[i];
                    string jsonString = JsonConvert.SerializeObject(testInput);
                    int sessionResult = TaskMain(new string[]{jsonString});
                    if(sessionResult == 1)
                        Log("Test " +(i+1)+ " succeeded, Computer won.");
                    else
                        Log("Failure: Test " +(i+1)+ " failed, computer not won while the input was: "+ jsonString);
                    }

                 TicTacToeInput[] compuerShouldDefendInputs = new TicTacToeInput[]{
                    new TicTacToeInput(new char[] { 'O', 'O', 'X',
                                                    'X', '-', 'X',
                                                    '-', '-', '-' }, 5),
                    new TicTacToeInput(new char[] { 'O', '-', '-',
                                                    'X', 'X', '-',
                                                    'O', '-', '-' }, 5),
                    new TicTacToeInput(new char[] { 'X', '-', 'O',
                                                    'O', '-', '-',
                                                    'X', 'X', '-' }, 5) ,
                    new TicTacToeInput(new char[] { 'X', 'O', '-',
                                                    'X', '-', '-',
                                                    'O', '-', 'X' }, 5) ,
                    new TicTacToeInput(new char[] { 'O', 'O', 'X',
                                                    'X', '-', 'X',
                                                    'O', 'X', '-' }, 7) };     

                    for(int i = 0; i < compuerShouldDefendInputs.Length; i++){
                        TicTacToeInput testInput = compuerShouldDefendInputs[i];
                        string jsonString = JsonConvert.SerializeObject(testInput);
                        int sessionResult = TaskMain(new string[]{jsonString});
                        if(sessionResult == 0 || sessionResult == 1)
                            Log("Test " +(i+1)+ " succeeded, computer not lost");
                        else
                            Log("Failure: Test " +(i+1)+ " failed, computer lost while the input was: "+ jsonString);
                    }              
                

            }
        }`;
    }
    static getNewMainHelpersClassesForShadowTest() {
        return `class Program
        {   
                
        static void Main(string[] args){
            
            new TicTacToeTests().run();
        }
        class TicTacToeShadowTests{
            public static bool isTurnEnded = false;
            public static int inputTrialsCounter;
            public static int turnCounter;
            public static string[]? userInputTrials;
            public static char[]? expectedBoard;
            public static void restartTestVariables(){
                expectedBoard = new char[] { '-', '-', '-',
                                             '-', '-', '-',
                                             '-', '-', '-' };
                turnCounter = 1;
                inputTrialsCounter = 1;                             
            }     
            public static void setUserInputTrialsForDraw(){
                userInputTrials = new string[] {"1", "1", "1", "1", "2", "2", 
                                                "2", "2", "1", "2", "1", "3", 
                                                "1", "2", "3", "1", "2", "1",
                                                "2", "3", "3", "2", "3", "3"};
            }   
            public static void setUserInputTrialsFoPlayerOneWins(){
                userInputTrials = new string[] {"1", "1", "2", "2", "1", "2",  
                                                "3", "1", "1", "3", "2", "3", 
                                                "3", "2", "3", "3", 
                                                "1", "1", "1", "1", "2", "2", 
                                                "2", "2", "1", "2", "1", "3", 
                                                "1", "2", "3", "1", "2", "1",
                                                "2", "3", "3", "2", "3", "3"};
            }    
            
            public static void setUserInputTrialsFoPlayerTwoWins(){
                userInputTrials = new string[] {"1", "3", "2", "2", "1", "2",
                                                "1", "1", "3", "2", "3", "3", 
                                                "2", "3",
                                                "1", "1", "1", "1", "2", "2", 
                                                "2", "2", "1", "2", "1", "3", 
                                                "1", "2", "3", "1", "2", "1",
                                                "2", "3", "3", "2", "3", "3"};
            }  
            public static void setExpectedBoardAndHandleTurnCounter(){
                int rowIndex = int.Parse(userInputTrials[inputTrialsCounter - 2]) - 1;
                int columnIndex = int.Parse(userInputTrials[inputTrialsCounter - 1]) - 1;

                char currentPlayerMark = turnCounter % 2 == 1 ? 'X' : 'O';
                int boardIndex = (rowIndex * 3) + columnIndex;
                if(expectedBoard[boardIndex] == '-'){
                    expectedBoard[boardIndex] = currentPlayerMark;
                    turnCounter++;
                }
            }

            public static void verifyCurrentBoard(char[] board){
                if(board.Length != expectedBoard.Length){
                    TicTacToeTests.Log($"Test failed - boards length not equal, User's board length is: {board.Length}, expected: {expectedBoard.Length}");
                }
                string userBoardJson = JsonConvert.SerializeObject(board);
                string expectedBoardJson = JsonConvert.SerializeObject(expectedBoard);
                string userInputTrialsJson = JsonConvert.SerializeObject(userInputTrials);

                bool areBoardEquivalent = true;
                for(int i=0; i< board.Length && areBoardEquivalent; i++){
                    if(board[i] == expectedBoard[i])
                        continue;
                    areBoardEquivalent = false;      
                }
                if(!areBoardEquivalent){
                    TicTacToeTests.Log($"Test failed - boards not equivalent, User's board: {userBoardJson}, expected: {expectedBoardJson}, inputs: {userInputTrialsJson}");  
                    return;
                }
                TicTacToeTests.Log($"Turn {TicTacToeShadowTests.turnCounter} - passed");
            }
        }
        class TicTacToeTests{
            
            public static void Log(string log)
            {
                string logFilePath = Path.Combine(Directory.GetCurrentDirectory(), "program-logs.txt");
                using (StreamWriter sw = File.AppendText(logFilePath))
                {
                   sw.WriteLine($"{log}");
                }
            }
            private void checkDrawPlay(){
                TicTacToeShadowTests.restartTestVariables();
                TicTacToeShadowTests.setUserInputTrialsForDraw();
                int sessionResult = TaskMain(new string[0]);
                bool isSessionSucceeded = sessionResult == 0;
                Log(($"Draw test - {(isSessionSucceeded ? "passed" : "failed")} - result: {sessionResult}, expected: 0"));
            }

            private void checkPlayerOneWinsPlay(){
                TicTacToeShadowTests.restartTestVariables();
                TicTacToeShadowTests.setUserInputTrialsFoPlayerOneWins();
                int sessionResult = TaskMain(new string[0]);
                int playerOneWinExpectedResult = 1;
                bool isSessionSucceeded = sessionResult == playerOneWinExpectedResult;
                Log(($"Player-One-Wins test - {(isSessionSucceeded ? "passed" : "failed")} - result: {sessionResult}, expected: {playerOneWinExpectedResult}"));
            }
            private void checkPlayerTwoWinsPlay(){
                TicTacToeShadowTests.restartTestVariables();
                TicTacToeShadowTests.setUserInputTrialsFoPlayerTwoWins();
                int sessionResult = TaskMain(new string[0]);
                int playerTowWinExpectedResult = 2;
                bool isSessionSucceeded = sessionResult == playerTowWinExpectedResult;
                Log(($"Player-Two-Wins test - {(isSessionSucceeded ? "passed" : "failed")} - result: {sessionResult}, expected: {playerTowWinExpectedResult}"));
            }
            public void run(){
                Log("Starting Tic Tac Toe Shadow Tests...");
                checkDrawPlay();
                checkPlayerOneWinsPlay();
                checkPlayerTwoWinsPlay();
             }
        }`;
    }
    async updateFileWithAutoTests(DOTNET_FILE_PATH, NEW_DOTNET_FILE_PATH) {
        try {
            this.logger.info(`Editing file: ${DOTNET_FILE_PATH}`);
            const fileText = await fs.promises.readFile(DOTNET_FILE_PATH, 'utf8');
            const usingJsonPartial = TicTacToeTestsService.getUsingJsonPartial();
            const data = (!fileText.includes(usingJsonPartial)) ? `using ${usingJsonPartial}; \n${fileText}` : fileText;
            const updatedData = data
                .replace(TicTacToeTestsService.getOldProgramMainSignature(), TicTacToeTestsService.getNewProgramMainSignature())
                .replace(TicTacToeTestsService.getGetUserInputRegex(), TicTacToeTestsService.getNewGetUserInputForAutoTest())
                .replace(TicTacToeTestsService.getGetInitializedBoardRegex(), TicTacToeTestsService.getNewGetInitializedBoardFunction())
                .replace(TicTacToeTestsService.getGetInitializedTurnCounterRegex(), TicTacToeTestsService.getNewGetInitializedTurnCounterFunction())
                .replace(TicTacToeTestsService.getProgramClassRegex(), TicTacToeTestsService.getNewMainHelpersClassesForAutoTest());
            await fs.promises.writeFile(NEW_DOTNET_FILE_PATH, updatedData);
            this.logger.info('File updated successfully!');
        }
        catch (error) {
            this.logger.error(error);
        }
    }
    async updateFileWithShadowTests(DOTNET_FILE_PATH, NEW_DOTNET_FILE_PATH) {
        try {
            this.logger.info(`Editing file: ${DOTNET_FILE_PATH}`);
            const fileText = await fs.promises.readFile(DOTNET_FILE_PATH, 'utf8');
            const usingJsonPartial = TicTacToeTestsService.getUsingJsonPartial();
            const data = (!fileText.includes(usingJsonPartial)) ? `using ${usingJsonPartial}; \n${fileText}` : fileText;
            const updatedData = data
                .replace(TicTacToeTestsService.getOldProgramMainSignature(), TicTacToeTestsService.getNewProgramMainSignature())
                .replace(TicTacToeTestsService.getGetUserInputRegex(), TicTacToeTestsService.getNewGetUserInputForShadowTest())
                .replace(TicTacToeTestsService.getPrintBoardRegex(), TicTacToeTestsService.getNewPrintBoardForShadowTest())
                .replace(TicTacToeTestsService.getProgramClassRegex(), TicTacToeTestsService.getNewMainHelpersClassesForShadowTest());
            await fs.promises.writeFile(NEW_DOTNET_FILE_PATH, updatedData);
            this.logger.info('File updated successfully!');
        }
        catch (error) {
            this.logger.error(error);
        }
    }
    async runDotNetProject(projectPath) {
        return await this.dotNetProjectTestsService.runDotNetProject(projectPath);
    }
}
exports.TicTacToeTestsService = TicTacToeTestsService;
exports.default = new TicTacToeTestsService(Logger_1.default, DotNetProjectTestsService_1.default);
const os = __importStar(require("os"));
const path = __importStar(require("path"));
const DotNetProjectTestsService_1 = __importDefault(require("./DotNetProjectTestsService"));
// import * as fs from 'fs';
const DIR_PATH = path.join(os.homedir(), 'VisualStudioPojects', 'tic-tac-toe-tests');
const DOTNET_FILE_PATH = path.join(DIR_PATH, 'Program.cs');
const filePath = '/home/or/VisualStudioPojects/tic-tac-toe-tests/Program.cs';
if (fs.existsSync(filePath))
    console.log("File Found - ", filePath);
else
    console.log("File not found - ", filePath);
const service = new TicTacToeTestsService(Logger_1.default, DotNetProjectTestsService_1.default);
// service.updateFileWithAutoTests(DOTNET_FILE_PATH, DOTNET_FILE_PATH)
//     .then(async ()=>{
//         await service.runDotNetProject(DIR_PATH)
//     }).catch((err)=> console.log({err}))
//
service.runDotNetProject(DIR_PATH).then(() => {
    console.log("Done.");
}).catch((err) => console.log(err.message));
//# sourceMappingURL=TicTacToeTestsService.js.map