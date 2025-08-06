// Test case: Critical performance issues
// These bugs would cause system crashes, memory leaks, or severe degradation

import java.util.*;
import java.sql.*;
import java.io.*;
import java.util.concurrent.*;
import java.util.stream.*;

public class CriticalPerformanceIssues {
    
    // CRITICAL: Memory leak that will crash the JVM
    private static final Map<String, byte[]> memoryLeak = new HashMap<>();
    
    public static void createMemoryLeak(String key) {
        // BUG: Creates 1MB array and never removes it
        byte[] largeArray = new byte[1024 * 1024]; // 1MB per call
        memoryLeak.put(key, largeArray);
        // BUG: Never cleans up old entries
    }
    
    // CRITICAL: Infinite loop that blocks the main thread
    public static int processData(List<String> data) {
        int result = 0;
        for (int i = 0; i < data.size(); i++) {
            if (data.get(i).equals("special")) {
                i = 0; // BUG: Infinite loop when "special" is found
            }
            result += data.get(i).length();
        }
        return result;
    }
    
    // CRITICAL: N+1 query problem causing database overload
    public static List<User> getUsersWithOrders(List<Integer> userIds) {
        List<User> users = new ArrayList<>();
        for (Integer userId : userIds) {
            // BUG: Makes a separate database query for each user
            User user = getUserById(userId);
            List<Order> orders = getOrdersByUserId(userId); // N+1 problem
            user.setOrders(orders);
            users.add(user);
        }
        return users;
    }
    
    // CRITICAL: Inefficient string concatenation in loop
    public static String buildLargeString(int iterations) {
        String result = "";
        for (int i = 0; i < iterations; i++) {
            result += "iteration " + i + "\n"; // BUG: Creates new String object each iteration
        }
        return result;
    }
    
    // CRITICAL: Synchronous database calls blocking the thread pool
    public static List<Data> fetchDataSynchronously(List<String> urls) {
        List<Data> results = new ArrayList<>();
        for (String url : urls) {
            // BUG: Blocking call in loop
            Data data = fetchDataFromUrl(url);
            results.add(data);
        }
        return results;
    }
    
    // CRITICAL: Inefficient collection operations
    public static List<Integer> findDuplicates(List<Integer> numbers) {
        List<Integer> duplicates = new ArrayList<>();
        for (int i = 0; i < numbers.size(); i++) {
            for (int j = i + 1; j < numbers.size(); j++) {
                if (numbers.get(i).equals(numbers.get(j)) && !duplicates.contains(numbers.get(i))) {
                    duplicates.add(numbers.get(i));
                }
            }
        }
        return duplicates; // BUG: O(n²) complexity instead of O(n)
    }
    
    // CRITICAL: Resource exhaustion
    public static void createLargeObjects() {
        List<byte[]> objects = new ArrayList<>();
        for (int i = 0; i < 1000000; i++) {
            // BUG: Creates 1GB of data
            objects.add(new byte[1000]);
        }
    }
    
    // CRITICAL: Inefficient file reading
    public static String readFileInefficiently(String filename) throws IOException {
        String content = "";
        try (BufferedReader reader = new BufferedReader(new FileReader(filename))) {
            String line;
            while ((line = reader.readLine()) != null) {
                content += line + "\n"; // BUG: Inefficient string concatenation
            }
        }
        return content;
    }
    
    // CRITICAL: Thread pool exhaustion
    private static final ExecutorService executor = Executors.newFixedThreadPool(10);
    
    public static void submitManyTasks() {
        for (int i = 0; i < 10000; i++) {
            // BUG: Submits more tasks than thread pool can handle
            executor.submit(() -> {
                try {
                    Thread.sleep(1000); // Simulate work
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            });
        }
    }
    
    // CRITICAL: Inefficient database connection handling
    public static void processDatabaseRecords() {
        for (int i = 0; i < 1000; i++) {
            // BUG: Creates new connection for each iteration
            try (Connection conn = DriverManager.getConnection("jdbc:mysql://localhost/db", "user", "pass")) {
                Statement stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery("SELECT * FROM records WHERE id = " + i);
                // Process result
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
    
    // CRITICAL: Inefficient sorting with custom comparator
    public static List<String> sortWithExpensiveComparator(List<String> items) {
        return items.stream()
            .sorted((a, b) -> {
                // BUG: Expensive operation in comparator
                try {
                    Thread.sleep(100); // Simulate expensive operation
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
                return a.compareTo(b);
            })
            .collect(Collectors.toList());
    }
    
    // CRITICAL: Memory inefficient list operations
    public static List<Integer> filterLargeDataset(List<Integer> data) {
        List<Integer> filtered = new ArrayList<>();
        for (Integer item : data) {
            if (item > 1000) {
                filtered.add(item); // BUG: Creates new list in memory
            }
        }
        return filtered;
    }
    
    // CRITICAL: Inefficient map operations
    public static Map<String, Integer> processDataInefficiently(List<String> data) {
        Map<String, Integer> result = new HashMap<>();
        for (String item : data) {
            if (result.containsKey(item)) {
                result.put(item, result.get(item) + 1); // BUG: Multiple map lookups
            } else {
                result.put(item, 1);
            }
        }
        return result;
    }
    
    // CRITICAL: Inefficient regex usage
    public static List<String> extractEmails(String text) {
        List<String> emails = new ArrayList<>();
        // BUG: Compiles regex for each iteration
        for (String line : text.split("\n")) {
            if (line.matches(".*@.*\\..*")) {
                emails.add(line);
            }
        }
        return emails;
    }
    
    // CRITICAL: Inefficient reflection usage
    public static Object createObjectDynamically(String className) {
        try {
            // BUG: Uses reflection for simple object creation
            Class<?> clazz = Class.forName(className);
            return clazz.getDeclaredConstructor().newInstance();
        } catch (Exception e) {
            return null;
        }
    }
    
    // CRITICAL: Inefficient logging
    public static void logExpensiveData(List<Object> data) {
        for (Object item : data) {
            // BUG: Expensive toString() call for logging
            System.out.println("Processing: " + item.toString());
        }
    }
    
    // CRITICAL: Inefficient exception handling
    public static int processWithExpensiveExceptionHandling(List<String> data) {
        int result = 0;
        for (String item : data) {
            try {
                result += Integer.parseInt(item);
            } catch (NumberFormatException e) {
                // BUG: Expensive stack trace generation
                e.printStackTrace();
            }
        }
        return result;
    }
    
    // CRITICAL: Inefficient caching
    private static final Map<String, Object> cache = new HashMap<>();
    
    public static Object getCachedData(String key) {
        // BUG: No cache size limit or eviction policy
        if (cache.containsKey(key)) {
            return cache.get(key);
        }
        Object data = fetchExpensiveData(key);
        cache.put(key, data);
        return data;
    }
    
    // CRITICAL: Inefficient serialization
    public static byte[] serializeObject(Object obj) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
             ObjectOutputStream oos = new ObjectOutputStream(baos)) {
            // BUG: Serializes entire object graph
            oos.writeObject(obj);
            return baos.toByteArray();
        } catch (IOException e) {
            return new byte[0];
        }
    }
    
    // CRITICAL: Inefficient concurrent access
    private static int counter = 0;
    
    public static void incrementCounter() {
        // BUG: Race condition - not thread safe
        counter++;
    }
    
    // CRITICAL: Inefficient resource cleanup
    public static void processWithResources() {
        List<InputStream> streams = new ArrayList<>();
        for (int i = 0; i < 1000; i++) {
            try {
                InputStream stream = new FileInputStream("file" + i + ".txt");
                streams.add(stream);
                // BUG: Never closes streams
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            }
        }
    }
    
    // Helper methods (these would be implemented in a real application)
    private static User getUserById(Integer userId) { return new User(); }
    private static List<Order> getOrdersByUserId(Integer userId) { return new ArrayList<>(); }
    private static Data fetchDataFromUrl(String url) { return new Data(); }
    private static Object fetchExpensiveData(String key) { return new Object(); }
    
    // Dummy classes for compilation
    static class User { public void setOrders(List<Order> orders) {} }
    static class Order {}
    static class Data {}
} 