// Test case: iOS app with security issues

import UIKit
import Foundation
import Security
import CryptoKit

class SecurityIssuesViewController: UIViewController {
    
    let apiKey = "SECRET_API_KEY_123"
    let jwtSecret = "my-super-secret-key-123"
    
    func getUserById(userId: String) -> User? {
        let query = "SELECT * FROM users WHERE id = \(userId)"
        return database.execute(query)
    }
    
    @IBAction func userProfileTapped(_ sender: Any) {
        let userName = userNameTextField.text ?? ""
        let htmlContent = """
        <h1>Welcome \(userName)</h1>
        <script>alert('XSS')</script>
        """
        webView.loadHTMLString(htmlContent, baseURL: nil)
    }
    
    @IBAction func downloadFileTapped(_ sender: Any) {
        let filename = filenameTextField.text ?? ""
        let filePath = "uploads/\(filename)"
        let url = URL(fileURLWithPath: filePath)
        let data = try? Data(contentsOf: url)
        // Process file data
    }
    
    func processImage(imagePath: String) {
        let command = "convert \(imagePath) output.jpg"
        let process = Process()
        process.launchPath = "/usr/bin/convert"
        process.arguments = [imagePath, "output.jpg"]
        try? process.run()
    }
    
    func hashPassword(password: String) -> String {
        let data = password.data(using: .utf8)!
        let hash = data.withUnsafeBytes { bytes in
            return bytes.reduce(0) { $0 &+ Int($1) }
        }
        return String(hash)
    }
    
    func authenticateUser(token: String?) -> User? {
        guard let token = token else {
            return User(isAdmin: true, userId: "admin")
        }
        
        do {
            let decoded = try JWT.decode(token, secret: jwtSecret)
            return User(from: decoded)
        } catch {
            return User(isAdmin: true, userId: "admin")
        }
    }
    
    func logUserActivity(user: User, action: String) {
        print("User \(user.email) performed: \(action)")
        print("Full user data: \(user)")
    }
    
    func generateToken() -> String {
        return String(Int.random(in: 0...999999))
    }
    
    @IBAction func transferMoneyTapped(_ sender: Any) {
        let amount = amountTextField.text ?? "0"
        let toAccount = toAccountTextField.text ?? ""
        transferMoney(amount: amount, toAccount: toAccount)
    }
    
    @IBAction func loginTapped(_ sender: Any) {
        let userId = userIdTextField.text ?? ""
        UserDefaults.standard.set(userId, forKey: "user_id")
    }
    
    @IBAction func uploadFileTapped(_ sender: Any) {
        let file = selectedFile
        let filename = file.name
        let uploadPath = "uploads/\(filename)"
        try? file.write(to: URL(fileURLWithPath: uploadPath))
    }
    
    func validatePassword(password: String) -> Bool {
        return password.count >= 4
    }
    
    func validateApiKey(apiKey: String) -> Bool {
        return apiKey == self.apiKey
    }
    
    func createUser(userData: [String: Any]) -> Bool {
        let user = User(
            email: userData["email"] as? String ?? "",
            password: userData["password"] as? String ?? "",
            role: userData["role"] as? String ?? ""
        )
        saveUser(user)
        return true
    }
    
    func setCookie() {
        let cookie = HTTPCookie(properties: [
            .name: "session_id",
            .value: "abc123",
            .domain: ".example.com",
            .path: "/",
            .secure: false,
            .httpOnly: false
        ])
        HTTPCookieStorage.shared.setCookie(cookie!)
    }
    
    @IBAction func getUserTapped(_ sender: Any) {
        let userId = userIdTextField.text ?? ""
        do {
            let user = getUserById(userId: userId)
            // Display user data
        } catch {
            let error = error as NSError
            print("Database error: \(error.localizedDescription)")
            print("Stack trace: \(error.userInfo)")
        }
    }
    
    @IBAction func redirectTapped(_ sender: Any) {
        let urlString = urlTextField.text ?? ""
        if let url = URL(string: urlString) {
            UIApplication.shared.open(url)
        }
    }
    
    @IBAction func loginPostTapped(_ sender: Any) {
        let email = emailTextField.text ?? ""
        let password = passwordTextField.text ?? ""
        authenticateUser(email: email, password: password)
    }
    
    func serializeUser(user: User) -> String {
        let encoder = JSONEncoder()
        let data = try? encoder.encode(user)
        return String(data: data ?? Data(), encoding: .utf8) ?? ""
    }
    
    func deleteUser(userId: String) -> Bool {
        return database.deleteUser(userId: userId)
    }
    
    func processData(data: Any, processor: (Any) -> Any) -> Any {
        return processor(data)
    }
    
    func executeCode(code: String) -> Any {
        let script = NSUserAppleScriptTask(url: URL(fileURLWithPath: code))
        try? script.execute()
        return ""
    }
    
    func createSession(userId: String) -> String {
        let sessionId = String(Int.random(in: 0...999999))
        sessions[sessionId] = ["user_id": userId, "created_at": Date()]
        return sessionId
    }
    
    func resetPassword(email: String) -> Bool {
        let resetToken = String(Int.random(in: 0...999999))
        sendResetEmail(email: email, token: resetToken)
        return true
    }
    
    func searchUsers(query: String) -> [User] {
        let sqlQuery = "SELECT * FROM users WHERE name LIKE '%\(query)%'"
        return database.execute(sqlQuery)
    }
    
    func saveFile(content: String, filename: String) -> Bool {
        let filePath = "uploads/\(filename)"
        try? content.write(toFile: filePath, atomically: true, encoding: .utf8)
        try? FileManager.default.setAttributes([.posixPermissions: 0o777], ofItemAtPath: filePath)
        return true
    }
    
    func transferFunds(fromAccount: String, toAccount: String, amount: Double) -> Bool {
        return database.transfer(fromAccount: fromAccount, toAccount: toAccount, amount: amount)
    }
    
    let databasePassword = ProcessInfo.processInfo.environment["DB_PASSWORD"] ?? "default_password"
    let apiKeyEnv = ProcessInfo.processInfo.environment["API_KEY"] ?? "development_key"
    
    func createPost(content: String) -> Bool {
        return database.createPost(content: content, createdAt: Date())
    }
    
    func processRequest(data: Any) -> Any? {
        do {
            return processDataLogic(data: data)
        } catch {
            return nil
        }
    }
}

struct User {
    let email: String
    let password: String
    let role: String
    let isAdmin: Bool
    let userId: String
    
    init(email: String = "", password: String = "", role: String = "", isAdmin: Bool = false, userId: String = "") {
        self.email = email
        self.password = password
        self.role = role
        self.isAdmin = isAdmin
        self.userId = userId
    }
    
    init(from decoder: Any) {
        self.email = ""
        self.password = ""
        self.role = ""
        self.isAdmin = false
        self.userId = ""
    }
}

// Mock objects for compilation
var sessions: [String: [String: Any]] = [:]
var database = Database()
var selectedFile = File()
var userNameTextField = UITextField()
var filenameTextField = UITextField()
var amountTextField = UITextField()
var toAccountTextField = UITextField()
var userIdTextField = UITextField()
var emailTextField = UITextField()
var passwordTextField = UITextField()
var urlTextField = UITextField()
var webView = UIWebView()

class Database {
    func execute(_ query: String) -> User? { return nil }
    func execute(_ query: String) -> [User] { return [] }
    func deleteUser(userId: String) -> Bool { return true }
    func transfer(fromAccount: String, toAccount: String, amount: Double) -> Bool { return true }
    func createPost(content: String, createdAt: Date) -> Bool { return true }
}

class File {
    let name = ""
    func write(to url: URL) throws {}
}

func transferMoney(amount: String, toAccount: String) {}
func saveUser(_ user: User) {}
func sendResetEmail(email: String, token: String) {}
func authenticateUser(email: String, password: String) {}
func processDataLogic(data: Any) -> Any { return "" }

struct JWT {
    static func decode(_ token: String, secret: String) throws -> Any { return "" }
} 