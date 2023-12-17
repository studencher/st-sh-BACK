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
exports.ChessTestsService = void 0;
const fs = __importStar(require("fs"));
const Logger_1 = __importDefault(require("../helpers/Logger"));
const DotNetProjectTestsService_1 = __importDefault(require("./DotNetProjectTestsService"));
class ChessTestsService {
    constructor(logger, dotNetProjectTestsService) {
        this.logger = logger;
        this.dotNetProjectTestsService = dotNetProjectTestsService;
    }
    static getOldProgramMainSignature() { return "static int Main"; }
    static getNewProgramMainSignature() { return "static int TaskMain"; }
    static getGetUserInputRegex() {
        return /static string getUserInput\(\)[^{]*{[^}]*}/g;
    }
    static getPrintToScreenRegex() {
        return /static void printToScreen\(string message\)\s*[^{]*\{[^}]*\}/g;
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
    static getNewGetUserInputForAutoTest() {
        return `static string getUserInput(){
        string nextPlayInput = ChessGameTests.getNextPlay();
        Console.WriteLine($"nextPlayInput - {nextPlayInput}");
        ChessGameTests.incrementNextPlayIndex();
        return nextPlayInput;
    }`;
    }
    static getNewPrintToScreenForAutoTest() {
        return `static void printToScreen(string message){ }`;
    }
    static getNewMainHelpersClassesForAutoTest() {
        return `class Program{
        static void Main(string[] args)
        {
           ChessGameTests.runTests();    
        }
    }
    
    class Logger
    {
        public static void info(string message)
        {
            string logFilePath = Path.Combine(Directory.GetCurrentDirectory(), "program-logs.txt");
            Console.WriteLine(logFilePath);
            using (StreamWriter sw = File.AppendText(logFilePath))
            {
                sw.WriteLine($"info - {message}");
            }
        }
        public static void error(string message)
        {
            string logFilePath = Path.Combine(Directory.GetCurrentDirectory(), "program-logs.txt");
            using (StreamWriter sw = File.AppendText(logFilePath))
            {
                sw.WriteLine($"Error - {message}.");
            }
        }
    }
    
    class CustomException : Exception {
        static string[] optionalStatuses = new string[] {"NONE", "MOVES_RUN_OUT"};
        string status;
        
        static void HandleException(Exception e) {
            if(e is CustomException ce)
            {
                if (ce.status == CustomException.optionalStatuses[1])
                    Logger.error("Moves run out");
                else if (ce.status == CustomException.optionalStatuses[0])
                    Logger.error("No status");
                else
                    Logger.error("No status");
            }
            Logger.error($"Unknown Exception: {e.Message}");
        }
        public CustomException(string message) : base(message) {
            this.status = CustomException.optionalStatuses[0];
        }
        public CustomException(string message, string status) : base(message) {
            this.status = CustomException.optionalStatuses.Contains(status) ? status : CustomException.optionalStatuses[0];
        }
    }
    
    class ChessGameTests
    {
        static int nextPlayIndex = 0;
        static string[] inputPlayBook = new string[] {};
        private static string[][,] expectedBoards;
        public static string getNextPlay()
        {
            if (nextPlayIndex >= inputPlayBook.Length)
                return null;
            return inputPlayBook[nextPlayIndex];
        }
        public static void incrementNextPlayIndex()
        {
            if(nextPlayIndex < inputPlayBook.Length)
                nextPlayIndex++;
            else
                throw new CustomException("Moves run out", "MOVES_RUN_OUT");
        }
    
        static void setHelpersVariablesForShortCastlingTest()
        {
            nextPlayIndex = 0;
            //  ,
            inputPlayBook = new string[]
                     {
                       "F2F4", "E7E5", "D2D4", "C7C6", "A2A3", "B7B5",
                       "E2E3", "D8A5", "C2C3", "D7D6", "F1E2", "G8F6",
                       "G1F3", "G7G5", "E1G1", "E5F4", "F1E1", "F4E3", "C1E3",
                       "F6G4", "C3C4", "A5C3", "B1D2", "C3B2", "D1C1",
                       "B2C1", "A1B1", "C1B1", "E2D1", "B1D1", "E1F1",
                       "D1E2", "F1F2", "G4F2", "H2H3", "F2G4", "D2B3",
                       "E2D1"
                     };
            setExpectedBoardByPlayBook();
        }
    
        static void setHelpersVariablesForLongCastlingTest()
        {
            nextPlayIndex = 0;
            inputPlayBook = new string[]
            {
                "G1F3", "B8C6", "B1C3", "G8F6", "B2B4", "B7B5", "G2G4", "C8A6",
                "C1A3", "A8B8", "D1B1", "G7G5", "B1B3", "B8B6", "E1C1", "C6B4",
                "C3D5", "B4A2", "C1B1", "B6C6", "F3G5", "F6E4", "D5F6", "E4F6",
                "G5E4", "F6E4", "D2D4", "E4D2", "B1A1", "C6C2", "D1E1", "F8G7",
                "A3C5", "G7D4", "B3C3", "D4C3"
            };
            setExpectedBoardByPlayBook();
        }
    
        static void setHelpersVariablesForDrawAgreementTest()
        {
            nextPlayIndex = 0;
            inputPlayBook = new string[] { "B1A3", "B8A6", "DRAW", "DRAW" };
            setExpectedBoardByPlayBook();
        }
    
        static void setHelpersVariablesForFiftyMoveRuleTest()
        {
            nextPlayIndex = 0;
            inputPlayBook = new string[]
         {
            "E2E4", "D7D5", "D2D4", "F7F5", "G2G4", "C7C5", "B2B4", "B8A6",
            "B1A3", "G8F6", "G1F3", "C8E6", "C1E3", "A8B8", "A1B1", "H8G8",
            "H1G1", "B8C8", "B1A1", "G8H8", "G1H1", "E6D7", "F1H3", "C8C6",
            "F3D2", "F6H5", "A3B5", "A6C7", "B5A3", "H5F6", "E3F4", "C7A8",
            "D2F1", "C6C8", "A1C1", "F6H5", "C1A1", "D7A4", "F4D2", "C8C6",
            "A1B1", "A8B6", "F1E3", "H8G8", "A3C4", "C6H6", "B1B2", "B6D7",
            "H3G2", "G8H8", "C4A5", "H5F4", "E3C4", "F4E6", "B2B1", "H8G8",
            "B1B2"
         };
        }
        static void setHelpersVariablesForDeadPositionTest()
        {
            nextPlayIndex = 0;
            inputPlayBook = new string[]
            {
                "E2E4", "D7D5", "E4D5", "E7E6", "C2C4", "E6D5", "C4D5", "C7C5",
                "D5C6", "B7B5", "C6C7", "D8C7", "D2D4", "A7A5", "G2G4", "F7F5",
                "G4F5", "C7D8", "C1G5", "C8F5", "G5D8", "B8C6", "B1C3", "C6B4",
                "D1D3", "B4D3", "E1D1", "F5G4", "F2F3", "G4F3", "G1F3", "G7G5",
                "F3G5", "G8F6", "G5F7", "E8F7", "D8F6", "F7F6", "B2B3", "B5B4",
                "C3D5", "F6F7", "H2H4", "A5A4", "H4H5", "A4B3", "A1B1", "B3B2",
                "B1B2", "B4B3", "B2B3", "A8B8", "B3B8", "F8E7", "D5B6", "H8B8",
                "B6C8", "B8C8", "D4D5", "C8A8", "D5D6", "E7D6", "A2A4", "A8A4",
                "H1H2", "A4A2", "H2A2", "D3E1", "D1E1", "D6H2", "A2A3", "H7H6",
                "F1B5", "F7E7", "B5D7", "E7D7", "A3A6", "D7C7", "A6B6", "C7B6",
                "E1F1", "H2G1", "F1G1"
            };
            setExpectedBoardByPlayBook();
        }
        
        static int getColumnIndex(char column)
        {
            return column - 'A';
        }
        
        static int getRowIndex(char row)
        {
            return 7 - ((int.Parse(row.ToString())) - 1);
        }
        static string[,] getBoardAfterPlay(string[,] board, string play)
        {
            bool isPlayIsDrawRequest = play == "DRAW";
            string[,] newBoard = new string[8, 8];
            int playStartColumn = isPlayIsDrawRequest ? 0 : getColumnIndex(play[0]);
            int playStartRow = isPlayIsDrawRequest ? 0 : getRowIndex(play[1]);
            int playEndColumn = isPlayIsDrawRequest ? 0 : getColumnIndex(play[2]);
            int playEndRow = isPlayIsDrawRequest ? 0 : getRowIndex(play[3]);
            string chosenPiece = isPlayIsDrawRequest ? "" : board[playStartRow, playStartColumn];
            if(!isPlayIsDrawRequest)
            {
                newBoard[playStartRow, playStartColumn] = "__";
                newBoard[playEndRow, playEndColumn] = chosenPiece;
            }
            
            for (int i = 0; i < 8; i++)
            {
                for(int j = 0; j < 8; j++)
                {
                    if ((i == playStartRow && j == playStartColumn)|| (i == playEndRow && j == playEndColumn) && !isPlayIsDrawRequest)
                        continue;
                    newBoard[i, j] = board[i, j];
                }
            }
            return newBoard;
        } 
        static void setExpectedBoardByPlayBook()
        {
            expectedBoards = new string[inputPlayBook.Length + 1][,];
            expectedBoards[0] = new string[,] {
    
                { "BR", "BN", "BB", "BQ", "BK", "BB", "BN", "BR" },
                { "BP", "BP", "BP", "BP", "BP", "BP", "BP", "BP" },
                { "__", "__", "__", "__", "__", "__", "__", "__" },
                { "__", "__", "__", "__", "__", "__", "__", "__" },
                { "__", "__", "__", "__", "__", "__", "__", "__" },
                { "__", "__", "__", "__", "__", "__", "__", "__" },
                { "WP", "WP", "WP", "WP", "WP", "WP", "WP", "WP" },
                { "WR", "WN", "WB", "WQ", "WK", "WB", "WN", "WR" }
                
                
            };
            for (int i = 0; i < inputPlayBook.Length; i++)
            {
                string currentPlay = inputPlayBook[i];
                expectedBoards[i + 1] = getBoardAfterPlay(expectedBoards[i], currentPlay);
                
            }
            
        }
    
        static void setHelpersVariablesForThreeFoldRepetitionTest()
        {
            nextPlayIndex = 0;
            inputPlayBook = new string[]
            {
                "G1F3", "G8F6", "F3G1", "F6G8",
                "B1A3", "B8A6", "A3B1", "A6B8",
                "B1A3", "B8A6", "A3B1", "A6B8",
                "B1A3", "B8A6", "A3B1", "A6B8",
                "B1A3", "B8A6", "A3B1", "A6B8", "B2B4"
            };
            setExpectedBoardByPlayBook();
        }
        
        
        static void setHelpersVariablesForPlayerOneWinTest()
        {
            nextPlayIndex = 0;
            inputPlayBook = new string[]
            {
                "E2E4", "G7G5", "B1C3", "F7F5", "D1H5"
            };
            setExpectedBoardByPlayBook();
        }
        static void setHelpersVariablesForPlayerTwoWinTest()
        {
            nextPlayIndex = 0;
            inputPlayBook = new string[]
            {
                "F2F3", "E7E5", "G2G4", "D8H4"
            };
            setExpectedBoardByPlayBook();
        }
        
        static void setHelpersVariablesForStalemateTest()
        {
            
            nextPlayIndex = 0;
            inputPlayBook = new string[]
            {
                    "C2C4", "D7D5", "D1B3", "C8H3", 
                    "G2H3", "F7F5", "B3B7", "E8F7", 
                    "B7A7", "F7G6", "F2F3", "C7C5", 
                    "A7E7", "A8A2", "E1F2", "A2B2", 
                    "E7G7", "G6H5", "G7G8", "B2B1", 
                    "A1B1", "H5H4", "G8H8", "H7H5", 
                    "H8H6", "F8H6", "B1B8", "H6E3", 
                    "D2E3", "D8B8", "F2G2", "B8F4", 
                    "E3F4", "D5D4", "C1E3", "D4E3"
                };
            setExpectedBoardByPlayBook();
        }
    
        public static void runTests()
        {
            TestThreeFoldRepetition();
            TestDrawAgreement();
            TestPlayerOneWin();
            TestPlayerTwoWin();
            TestFiftyMoveRule();
            // TODO - test the functions below
            // TestStalemate();
            // TestBlackwinAfterWhiteLongCastling();
            // TestDeadPosition();
            // TestBlackwinAfterWhiteShortCastling();
        }
        
        public static void TestBlackwinAfterWhiteShortCastling()
        {
            try
            {
                setHelpersVariablesForShortCastlingTest();
                int playResult = new ChessGame().play();
                if (playResult == 1)
                    Logger.info("PASS - Blackwin After White Castling Test Success");
                else
                    Logger.info("FAILURE - Blackwin After White Castling Test Failed");
            }
            catch (Exception e)
            {
                Logger.error(e.Message);
            }
        }
        public static void TestBlackwinAfterWhiteLongCastling()
        {
            try
            {
                setHelpersVariablesForLongCastlingTest();
                int playResult = new ChessGame().play();
                if (playResult == 1)
                    Logger.info("PASS - Blackwin After White Castling Test Success");
                else
                    Logger.info("FAILURE - Blackwin After White Castling Test Failed");
            }
            catch (Exception e)
            {
                Logger.error(e.Message);
            }
        }
        static void TestDrawAgreement()
        {
            try
            {
                setHelpersVariablesForDrawAgreementTest();
                int playResult = new ChessGame().play();
                if (playResult == 0)
                    Logger.info("PASS - Draw Agreement Test Success");
                else
                    Logger.info("FAILURE - Draw Agreement Test Failed");
            }
            catch (Exception e)
            {
                Logger.error(e.Message);
            }
    
        }
    
        static void TestFiftyMoveRule()
        {
            setHelpersVariablesForFiftyMoveRuleTest();
            int playResult = new ChessGame().play();
            if (playResult == 0)
                Logger.info("PASS - Fifty Move Rule Test Success");
            else
                Logger.info("FAILURE - Fifty Move Rule Test Failed");
        }
        static void TestDeadPosition()
        {
            try
            {
                setHelpersVariablesForDeadPositionTest();
                int playResult = new ChessGame().play();
                if (playResult == 0)
                    Logger.info("PASS - Dead Position Test Success");
                else
                    Logger.info("FAILURE - Dead Position Test Failed");
            }
            catch (Exception e)
            {
                Logger.error(e.Message);
                }
        }
        
        static void TestThreeFoldRepetition()
        {
            try
            {
                setHelpersVariablesForThreeFoldRepetitionTest();
                int playResult = new ChessGame().play();
                if (playResult == 0)
                    Logger.info("PASS - Three Fold Repetition Test Success");
                else
                    Logger.info("FAILURE - Three Fold Repetition Test Failed");
            }
            catch (Exception e)
            {
                Logger.error(e.Message);
            }
        }
    
        static void TestPlayerOneWin()
        {
            setHelpersVariablesForPlayerOneWinTest();
            int playResult = new ChessGame().play();
            if (playResult == 1)
                Logger.info("PASS - Player One Win Test Success");
            else
                Logger.info("FAILURE - Player One Win Test Failed");
        }
        static void TestPlayerTwoWin()
        {
            setHelpersVariablesForPlayerTwoWinTest();
            int playResult = new ChessGame().play();
            if (playResult == 2)
                Logger.info("PASS - Player Two Win Test Success");
            else
                Logger.info("FAILURE - Player Two Win Test Failed");
        }
    
        static void TestStalemate()
        {
            setHelpersVariablesForStalemateTest();
            int playResult = new ChessGame().play();
            if (playResult == 0)
                Logger.info("PASS - Stalemate Test Success");
            else
                Logger.info("FAILURE - Stalemate Test Failed");
        }
        `;
        //     Not closing the program class because considering the user has the Main method in it (and
        //     it will be conerted to be TaskMain method)
    }
    async updateFileWithAutoTests(DOTNET_FILE_PATH, NEW_DOTNET_FILE_PATH) {
        try {
            this.logger.info(`Editing file: ${DOTNET_FILE_PATH}`);
            const fileText = await fs.promises.readFile(DOTNET_FILE_PATH, 'utf8');
            const updatedData = fileText
                .replace(ChessTestsService.getOldProgramMainSignature(), ChessTestsService.getNewProgramMainSignature())
                .replace(ChessTestsService.getGetUserInputRegex(), ChessTestsService.getNewGetUserInputForAutoTest())
                .replace(ChessTestsService.getPrintToScreenRegex(), ChessTestsService.getNewPrintToScreenForAutoTest())
                .replace(ChessTestsService.getProgramClassRegex(), ChessTestsService.getNewMainHelpersClassesForAutoTest());
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
exports.ChessTestsService = ChessTestsService;
exports.default = new ChessTestsService(Logger_1.default, DotNetProjectTestsService_1.default);
//# sourceMappingURL=ChessTestsService.js.map