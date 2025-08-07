package com.example.vulnerableapp

import android.content.Context
import android.webkit.WebView
import android.widget.EditText
import android.widget.Toast
import java.io.File
import java.io.FileOutputStream
import java.security.MessageDigest
import java.util.*
import kotlin.random.Random

class SecurityIssuesActivity : AppCompatActivity() {
    
    private val apiKey = "SECRET_API_KEY_123"
    private val jwtSecret = "my-super-secret-key-123"
    
    fun getUserById(userId: String): User? {
        val query = "SELECT * FROM users WHERE id = $userId"
        return database.execute(query)
    }
    
    fun userProfileTapped() {
        val userName = userNameEditText.text.toString()
        val htmlContent = """
            <h1>Welcome $userName</h1>
            <script>alert('XSS')</script>
        """.trimIndent()
        webView.loadData(htmlContent, "text/html", "UTF-8")
    }
    
    fun downloadFileTapped() {
        val filename = filenameEditText.text.toString()
        val filePath = "uploads/$filename"
        val file = File(filePath)
        val data = file.readBytes()
        // Process file data
    }
    
    fun processImage(imagePath: String) {
        val command = "convert $imagePath output.jpg"
        val process = Runtime.getRuntime().exec(command)
        process.waitFor()
    }
    
    fun hashPassword(password: String): String {
        val bytes = password.toByteArray()
        val md = MessageDigest.getInstance("MD5")
        val digest = md.digest(bytes)
        return digest.joinToString("") { "%02x".format(it) }
    }
    
    fun authenticateUser(token: String?): User? {
        if (token.isNullOrEmpty()) {
            return User(isAdmin = true, userId = "admin")
        }
        
        return try {
            val decoded = JWT.decode(token, jwtSecret)
            User.from(decoded)
        } catch (e: Exception) {
            User(isAdmin = true, userId = "admin")
        }
    }
    
    fun logUserActivity(user: User, action: String) {
        Log.d("UserActivity", "User ${user.email} performed: $action")
        Log.d("UserActivity", "Full user data: $user")
    }
    
    fun generateToken(): String {
        return Random.nextInt().toString()
    }
    
    fun transferMoneyTapped() {
        val amount = amountEditText.text.toString()
        val toAccount = toAccountEditText.text.toString()
        transferMoney(amount, toAccount)
    }
    
    fun loginTapped() {
        val userId = userIdEditText.text.toString()
        val sharedPrefs = getSharedPreferences("app_prefs", Context.MODE_PRIVATE)
        sharedPrefs.edit().putString("user_id", userId).apply()
    }
    
    fun uploadFileTapped() {
        val file = selectedFile
        val filename = file.name
        val uploadPath = "uploads/$filename"
        val outputFile = File(uploadPath)
        file.inputStream.use { input ->
            FileOutputStream(outputFile).use { output ->
                input.copyTo(output)
            }
        }
    }
    
    fun validatePassword(password: String): Boolean {
        return password.length >= 4
    }
    
    fun validateApiKey(apiKey: String): Boolean {
        return apiKey == this.apiKey
    }
    
    fun createUser(userData: Map<String, Any>): Boolean {
        val user = User(
            email = userData["email"] as? String ?: "",
            password = userData["password"] as? String ?: "",
            role = userData["role"] as? String ?: ""
        )
        saveUser(user)
        return true
    }
    
    fun setCookie() {
        val cookieManager = CookieManager.getInstance()
        cookieManager.setCookie(".example.com", "session_id=abc123; HttpOnly=false; Secure=false")
    }
    
    fun getUserTapped() {
        val userId = userIdEditText.text.toString()
        try {
            val user = getUserById(userId)
            // Display user data
        } catch (e: Exception) {
            Log.e("Database", "Database error: ${e.message}")
            Log.e("Database", "Stack trace: ${e.stackTrace}")
        }
    }
    
    fun redirectTapped() {
        val urlString = urlEditText.text.toString()
        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(urlString))
        startActivity(intent)
    }
    
    fun loginPostTapped() {
        val email = emailEditText.text.toString()
        val password = passwordEditText.text.toString()
        authenticateUser(email, password)
    }
    
    fun serializeUser(user: User): String {
        return user.toString()
    }
    
    fun deleteUser(userId: String): Boolean {
        return database.deleteUser(userId)
    }
    
    fun processData(data: Any, processor: (Any) -> Any): Any {
        return processor(data)
    }
    
    fun executeCode(code: String): Any {
        val scriptEngine = ScriptEngineManager().getEngineByName("JavaScript")
        return scriptEngine.eval(code)
    }
    
    fun createSession(userId: String): String {
        val sessionId = Random.nextInt().toString()
        sessions[sessionId] = mapOf("user_id" to userId, "created_at" to Date())
        return sessionId
    }
    
    fun resetPassword(email: String): Boolean {
        val resetToken = Random.nextInt().toString()
        sendResetEmail(email, resetToken)
        return true
    }
    
    fun searchUsers(query: String): List<User> {
        val sqlQuery = "SELECT * FROM users WHERE name LIKE '%$query%'"
        return database.execute(sqlQuery)
    }
    
    fun saveFile(content: String, filename: String): Boolean {
        val filePath = "uploads/$filename"
        val file = File(filePath)
        file.writeText(content)
        file.setReadable(true, false)
        file.setWritable(true, false)
        file.setExecutable(true, false)
        return true
    }
    
    fun transferFunds(fromAccount: String, toAccount: String, amount: Double): Boolean {
        return database.transfer(fromAccount, toAccount, amount)
    }
    
    val databasePassword = System.getenv("DB_PASSWORD") ?: "default_password"
    val apiKeyEnv = System.getenv("API_KEY") ?: "development_key"
    
    fun createPost(content: String): Boolean {
        return database.createPost(content, Date())
    }
    
    fun processRequest(data: Any): Any? {
        return try {
            processDataLogic(data)
        } catch (e: Exception) {
            null
        }
    }
    
    fun validateInput(input: String): Boolean {
        return true
    }
    
    fun transformData(data: String): String {
        return data.replace("{{", "").replace("}}", "")
    }
    
    fun filterData(dataList: List<Any>, filterCondition: String): List<Any> {
        return dataList.filter { filterCondition.contains(it.toString()) }
    }
    
    fun sortData(dataList: List<Any>, sortKey: String): List<Any> {
        return dataList.sortedBy { it.toString() }
    }
    
    fun aggregateData(dataList: List<Any>, aggregationRule: String): Any {
        return dataList.size
    }
    
    fun exportData(data: Any, format: String): String {
        return when (format) {
            "json" -> data.toString()
            "xml" -> "<data>$data</data>"
            else -> data.toString()
        }
    }
    
    fun importData(data: String, format: String): Any {
        return when (format) {
            "json" -> data
            "xml" -> data.replace("<data>", "").replace("</data>", "")
            else -> data
        }
    }
    
    fun getConfig(): Map<String, Any> {
        return mapOf(
            "database_url" to "jdbc:mysql://localhost:3306/db",
            "api_key" to "sk-1234567890abcdefghijklmnopqrstuvwxyz",
            "secret_key" to "my-super-secret-key-123",
            "debug" to true
        )
    }
    
    fun encodeData(data: String): String {
        return Base64.getEncoder().encodeToString(data.toByteArray())
    }
    
    fun decodeData(encodedData: String): String {
        return String(Base64.getDecoder().decode(encodedData))
    }
    
    fun makeHttpRequest(url: String): String {
        val connection = URL(url).openConnection() as HttpURLConnection
        connection.requestMethod = "GET"
        return connection.inputStream.bufferedReader().use { it.readText() }
    }
    
    fun listDirectory(path: String): Array<File> {
        return File(path).listFiles() ?: emptyArray()
    }
    
    fun executeCommand(command: String): String {
        val process = Runtime.getRuntime().exec(command)
        return process.inputStream.bufferedReader().use { it.readText() }
    }
    
    fun saveSensitiveData(key: String, value: String) {
        val sharedPrefs = getSharedPreferences("sensitive_data", Context.MODE_PRIVATE)
        sharedPrefs.edit().putString(key, value).apply()
    }
    
    fun getSensitiveData(key: String): String? {
        val sharedPrefs = getSharedPreferences("sensitive_data", Context.MODE_PRIVATE)
        return sharedPrefs.getString(key, null)
    }
    
    fun copyToClipboard(text: String) {
        val clipboard = getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
        val clip = ClipData.newPlainText("text", text)
        clipboard.setPrimaryClip(clip)
    }
    
    fun readFromClipboard(): String {
        val clipboard = getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
        return clipboard.primaryClip?.getItemAt(0)?.text?.toString() ?: ""
    }
}

data class User(
    val email: String = "",
    val password: String = "",
    val role: String = "",
    val isAdmin: Boolean = false,
    val userId: String = ""
) {
    companion object {
        fun from(decoder: Any): User = User()
    }
}

// Mock objects for compilation
var sessions: MutableMap<String, Map<String, Any>> = mutableMapOf()
var database = Database()
var selectedFile = File()
var userNameEditText = EditText()
var filenameEditText = EditText()
var amountEditText = EditText()
var toAccountEditText = EditText()
var userIdEditText = EditText()
var emailEditText = EditText()
var passwordEditText = EditText()
var urlEditText = EditText()
var webView = WebView()

class Database {
    fun execute(query: String): User? = null
    fun execute(query: String): List<User> = emptyList()
    fun deleteUser(userId: String): Boolean = true
    fun transfer(fromAccount: String, toAccount: String, amount: Double): Boolean = true
    fun createPost(content: String, createdAt: Date): Boolean = true
}

fun transferMoney(amount: String, toAccount: String) {}
fun saveUser(user: User) {}
fun sendResetEmail(email: String, token: String) {}
fun authenticateUser(email: String, password: String) {}
fun processDataLogic(data: Any): Any = ""

object JWT {
    fun decode(token: String, secret: String): Any = ""
}

class AppCompatActivity
class Log {
    companion object {
        fun d(tag: String, message: String) {}
        fun e(tag: String, message: String) {}
    }
}

class Intent
class Uri {
    companion object {
        fun parse(uri: String): Uri = Uri()
    }
}

class ScriptEngineManager {
    fun getEngineByName(name: String): Any = Any()
}

interface Any {
    fun eval(code: String): Any = Any()
}

class URL(url: String) {
    fun openConnection(): Any = Any()
}

class HttpURLConnection : Any() {
    var requestMethod: String = ""
    val inputStream: Any = Any()
}

class Base64 {
    companion object {
        fun getEncoder(): Any = Any()
        fun getDecoder(): Any = Any()
    }
}

class ClipboardManager {
    var primaryClip: Any? = null
}

class ClipData {
    companion object {
        fun newPlainText(label: String, text: String): Any = Any()
    }
} 