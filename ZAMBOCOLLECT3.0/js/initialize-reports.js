// ZamboCollect Report Initializer
// Run this in the browser console on any ZamboCollect page to create sample reports

(function() {
    // Clear existing reports
    localStorage.removeItem('zc_reports');

    // Mock REPORTS_DB functions
    var REPORTS_DB = {
        add: function(data) {
            var reports = JSON.parse(localStorage.getItem('zc_reports') || '[]');
            var id = 'RPT-' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 100);
            var report = {
                id: id,
                location: data.location,
                barangay: data.barangay,
                wasteType: data.wasteType,
                urgency: data.urgency,
                description: data.description || '',
                timestamp: new Date().toISOString(),
                dateStr: new Date().toLocaleString('en-US', {
                    year: 'numeric', month: 'short', day: '2-digit',
                    hour: '2-digit', minute: '2-digit'
                }),
                citizen: data.citizen || 'Citizen',
                contact: data.contact || '',
                status: 'pending'
            };
            reports.unshift(report);
            localStorage.setItem('zc_reports', JSON.stringify(reports));
            return report;
        },

        approve: function(id, officerName) {
            var reports = JSON.parse(localStorage.getItem('zc_reports') || '[]');
            for (var i = 0; i < reports.length; i++) {
                if (reports[i].id === id) {
                    reports[i].status = 'approved';
                    reports[i].approvedBy = officerName || 'Officer';
                    reports[i].approvedDate = new Date().toLocaleString('en-US', {
                        year: 'numeric', month: 'short', day: '2-digit'
                    });
                    reports[i].assignedDriver = ['Rodel Macaraeg (Truck #04)', 'Carlo Dimacali (Truck #01)', 'Mark Alvarado (Truck #07)'][Math.floor(Math.random() * 3)];
                    localStorage.setItem('zc_reports', JSON.stringify(reports));
                    return reports[i];
                }
            }
        },

        reject: function(id, reason, officerName) {
            var reports = JSON.parse(localStorage.getItem('zc_reports') || '[]');
            for (var i = 0; i < reports.length; i++) {
                if (reports[i].id === id) {
                    reports[i].status = 'rejected';
                    reports[i].rejectedBy = officerName || 'Officer';
                    reports[i].rejectedDate = new Date().toLocaleString('en-US', {
                        year: 'numeric', month: 'short', day: '2-digit'
                    });
                    reports[i].rejectionReason = reason || 'No reason provided';
                    localStorage.setItem('zc_reports', JSON.stringify(reports));
                    return reports[i];
                }
            }
        }
    };

    // Sample report data
    var sampleReports = [
        {
            location: 'Rizal Street, Zone 3',
            barangay: 'Rio Hondo',
            wasteType: 'household',
            urgency: 'low',
            description: 'Accumulated household waste from weekly cleaning',
            citizen: 'Maria Santos',
            contact: '+63 917 123 4567'
        },
        {
            location: 'Market Area, Poblacion',
            barangay: 'Rio Hondo',
            wasteType: 'commercial',
            urgency: 'medium',
            description: 'Commercial waste from local market stalls',
            citizen: 'Roberto Dela Cruz',
            contact: '+63 918 234 5678'
        },
        {
            location: 'Construction Site, Highway 1',
            barangay: 'Rio Hondo',
            wasteType: 'construction',
            urgency: 'high',
            description: 'Construction debris from building renovation',
            citizen: 'Ana Garcia',
            contact: '+63 919 345 6789'
        },
        {
            location: 'Industrial Zone, Block 5',
            barangay: 'Rio Hondo',
            wasteType: 'hazardous',
            urgency: 'critical',
            description: 'Hazardous chemical waste from laboratory',
            citizen: 'Dr. Jose Reyes',
            contact: '+63 920 456 7890'
        },
        {
            location: 'Beachfront Area',
            barangay: 'Rio Hondo',
            wasteType: 'illegal',
            urgency: 'high',
            description: 'Illegal dumping of construction materials on beach',
            citizen: 'Elena Torres',
            contact: '+63 921 567 8901'
        },
        {
            location: 'Central Park',
            barangay: 'Rio Hondo',
            wasteType: 'household',
            urgency: 'medium',
            description: 'Mixed waste from park visitors',
            citizen: 'Carlos Mendoza',
            contact: '+63 922 678 9012'
        },
        {
            location: 'School Compound, Zone 2',
            barangay: 'Rio Hondo',
            wasteType: 'other',
            urgency: 'low',
            description: 'General waste from school activities',
            citizen: 'Teacher Lina Cruz',
            contact: '+63 923 789 0123'
        },
        {
            location: 'Residential Area, Phase 1',
            barangay: 'Rio Hondo',
            wasteType: 'household',
            urgency: 'medium',
            description: 'Weekly household waste collection needed',
            citizen: 'Pedro Villanueva',
            contact: '+63 924 890 1234'
        }
    ];

    console.log('🗂️ Initializing ZamboCollect sample reports...');

    var createdReports = [];

    // Add all pending reports
    sampleReports.forEach(function(reportData, index) {
        var report = REPORTS_DB.add(reportData);
        createdReports.push(report);
        console.log(`✅ Created: ${report.id} - ${report.location} (${report.wasteType})`);
    });

    // Approve first 3 reports
    createdReports.slice(0, 3).forEach(function(report) {
        REPORTS_DB.approve(report.id, 'Officer Maria Santos');
        console.log(`✅ Approved: ${report.id}`);
    });

    // Reject one report (the hazardous one)
    if (createdReports.length > 3) {
        REPORTS_DB.reject(createdReports[3].id, 'Hazardous waste requires special handling procedures', 'Officer Maria Santos');
        console.log(`❌ Rejected: ${createdReports[3].id}`);
    }

    var finalReports = JSON.parse(localStorage.getItem('zc_reports') || '[]');
    var stats = { total: finalReports.length, pending: 0, approved: 0, rejected: 0 };

    finalReports.forEach(function(r) {
        if (r.status === 'pending') stats.pending++;
        if (r.status === 'approved') stats.approved++;
        if (r.status === 'rejected') stats.rejected++;
    });

    console.log('📊 Final Stats:', stats);
    console.log('🎉 Sample reports initialized successfully!');
    console.log('Refresh your ZamboCollect pages to see the new reports.');
})();