import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:hive/hive.dart';
import 'package:http/http.dart' as http;
import 'package:jitsi_meet_wrapper/jitsi_meet_wrapper.dart';
import 'qr_scanner_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  Map<String, dynamic> _userData = {};
  List<dynamic> _timetable = [];
  bool _isOffline = false;

  @override
  void initState() {
    super.initState();
    _loadUserData();
    _fetchTimetable();
  }

  void _loadUserData() {
    final box = Hive.box('userBox');
    setState(() {
      _userData = Map<String, dynamic>.from(box.get('userData', defaultValue: {}));
    });
  }

  Future<void> _fetchTimetable() async {
    final box = Hive.box('timetableBox');
    try {
      final response = await http.post(
        Uri.parse('http://10.0.2.2:8000/api/mobile/timetable/'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'user_id': _userData['id']}),
      ).timeout(const Duration(seconds: 5));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          _timetable = data['data'];
          _isOffline = false;
        });
        // Cache to Hive for offline mode
        await box.put('timetableData', _timetable);
      }
    } catch (e) {
      // Offline fallback
      setState(() {
        _isOffline = true;
        _timetable = box.get('timetableData', defaultValue: []);
      });
    }
  }

  void _joinLiveClass() async {
    // Generate a random room ID or fetch from API
    String roomName = "college-erp-live-12345";
    
    var options = JitsiMeetingOptions(
      roomNameOrUrl: roomName,
      serverUrl: "https://meet.jit.si",
      subject: "Live Virtual Class",
      userDisplayName: "${_userData['first_name']} ${_userData['last_name']}",
      userEmail: _userData['email'],
      isAudioMuted: true,
      isVideoMuted: true,
    );

    await JitsiMeetWrapper.joinMeeting(options: options);
  }

  void _logout() {
    Hive.box('userBox').clear();
    Navigator.pushReplacementNamed(context, '/');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard'),
        backgroundColor: Colors.indigo,
        foregroundColor: Colors.white,
        actions: [
          IconButton(icon: const Icon(Icons.qr_code_scanner), onPressed: () {
            Navigator.push(context, MaterialPageRoute(builder: (_) => const QRScannerScreen()));
          }),
          IconButton(icon: const Icon(Icons.logout), onPressed: _logout),
        ],
      ),
      body: Column(
        children: [
          if (_isOffline)
            Container(
              color: Colors.orangeAccent,
              width: double.infinity,
              padding: const EdgeInsets.all(8.0),
              child: const Text(
                'Offline Mode: Showing cached data',
                textAlign: TextAlign.center,
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
          
          Container(
            padding: const EdgeInsets.all(16.0),
            color: Colors.indigo.shade50,
            child: Row(
              children: [
                CircleAvatar(
                  radius: 30,
                  backgroundColor: Colors.indigo,
                  child: Text(
                    _userData['first_name']?.substring(0,1) ?? 'U',
                    style: const TextStyle(fontSize: 24, color: Colors.white),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Welcome, ${_userData['first_name'] ?? 'User'}',
                        style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                      ),
                      Text(_userData['email'] ?? ''),
                    ],
                  ),
                ),
              ],
            ),
          ),
          
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: ElevatedButton.icon(
              onPressed: _joinLiveClass,
              icon: const Icon(Icons.video_call),
              label: const Text('Join Live Class'),
              style: ElevatedButton.styleFrom(
                minimumSize: const Size(double.infinity, 50),
                backgroundColor: Colors.redAccent,
                foregroundColor: Colors.white,
              ),
            ),
          ),
          
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
            child: Align(
              alignment: Alignment.centerLeft,
              child: Text('Your Timetable', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            ),
          ),
          
          Expanded(
            child: _timetable.isEmpty
                ? const Center(child: Text('No timetable data available.'))
                : ListView.builder(
                    itemCount: _timetable.length,
                    itemBuilder: (context, index) {
                      final item = _timetable[index];
                      return Card(
                        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        child: ListTile(
                          leading: const CircleAvatar(child: Icon(Icons.book)),
                          title: Text(item['subject']),
                          subtitle: Text('${item['day']} • ${item['start_time']} - ${item['end_time']}'),
                          trailing: Text(item['classroom']),
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
