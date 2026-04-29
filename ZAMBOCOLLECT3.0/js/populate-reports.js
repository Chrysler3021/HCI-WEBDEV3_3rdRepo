// Direct localStorage population for ZamboCollect reports
// Copy and paste this into browser console on any ZamboCollect page

(function() {
    var reports = [
        {
            "id": "RPT-001",
            "location": "Rizal Street, Zone 3",
            "barangay": "Rio Hondo",
            "wasteType": "household",
            "urgency": "low",
            "description": "Accumulated household waste from weekly cleaning",
            "timestamp": "2024-04-29T10:30:00.000Z",
            "dateStr": "Apr 29, 2024, 10:30 AM",
            "citizen": "Maria Santos",
            "contact": "+63 917 123 4567",
            "status": "approved",
            "approvedBy": "Officer Maria Santos",
            "approvedDate": "Apr 29, 2024",
            "assignedDriver": "Rodel Macaraeg (Truck #04)"
        },
        {
            "id": "RPT-002",
            "location": "Market Area, Poblacion",
            "barangay": "Rio Hondo",
            "wasteType": "commercial",
            "urgency": "medium",
            "description": "Commercial waste from local market stalls",
            "timestamp": "2024-04-29T09:15:00.000Z",
            "dateStr": "Apr 29, 2024, 9:15 AM",
            "citizen": "Roberto Dela Cruz",
            "contact": "+63 918 234 5678",
            "status": "approved",
            "approvedBy": "Officer Maria Santos",
            "approvedDate": "Apr 29, 2024",
            "assignedDriver": "Carlo Dimacali (Truck #01)"
        },
        {
            "id": "RPT-003",
            "location": "Construction Site, Highway 1",
            "barangay": "Rio Hondo",
            "wasteType": "construction",
            "urgency": "high",
            "description": "Construction debris from building renovation",
            "timestamp": "2024-04-29T08:45:00.000Z",
            "dateStr": "Apr 29, 2024, 8:45 AM",
            "citizen": "Ana Garcia",
            "contact": "+63 919 345 6789",
            "status": "pending"
        },
        {
            "id": "RPT-004",
            "location": "Industrial Zone, Block 5",
            "barangay": "Rio Hondo",
            "wasteType": "hazardous",
            "urgency": "critical",
            "description": "Hazardous chemical waste from laboratory",
            "timestamp": "2024-04-29T11:20:00.000Z",
            "dateStr": "Apr 29, 2024, 11:20 AM",
            "citizen": "Dr. Jose Reyes",
            "contact": "+63 920 456 7890",
            "status": "rejected",
            "rejectedBy": "Officer Maria Santos",
            "rejectedDate": "Apr 29, 2024",
            "rejectionReason": "Hazardous waste requires special handling procedures"
        },
        {
            "id": "RPT-005",
            "location": "Beachfront Area",
            "barangay": "Rio Hondo",
            "wasteType": "illegal",
            "urgency": "high",
            "description": "Illegal dumping of construction materials on beach",
            "timestamp": "2024-04-29T07:30:00.000Z",
            "dateStr": "Apr 29, 2024, 7:30 AM",
            "citizen": "Elena Torres",
            "contact": "+63 921 567 8901",
            "status": "pending"
        },
        {
            "id": "RPT-006",
            "location": "Central Park",
            "barangay": "Rio Hondo",
            "wasteType": "household",
            "urgency": "medium",
            "description": "Mixed waste from park visitors",
            "timestamp": "2024-04-29T12:00:00.000Z",
            "dateStr": "Apr 29, 2024, 12:00 PM",
            "citizen": "Carlos Mendoza",
            "contact": "+63 922 678 9012",
            "status": "pending"
        },
        {
            "id": "RPT-007",
            "location": "School Compound, Zone 2",
            "barangay": "Rio Hondo",
            "wasteType": "other",
            "urgency": "low",
            "description": "General waste from school activities",
            "timestamp": "2024-04-29T13:15:00.000Z",
            "dateStr": "Apr 29, 2024, 1:15 PM",
            "citizen": "Teacher Lina Cruz",
            "contact": "+63 923 789 0123",
            "status": "approved",
            "approvedBy": "Officer Maria Santos",
            "approvedDate": "Apr 29, 2024",
            "assignedDriver": "Mark Alvarado (Truck #07)"
        },
        {
            "id": "RPT-008",
            "location": "Residential Area, Phase 1",
            "barangay": "Rio Hondo",
            "wasteType": "household",
            "urgency": "medium",
            "description": "Weekly household waste collection needed",
            "timestamp": "2024-04-29T14:30:00.000Z",
            "dateStr": "Apr 29, 2024, 2:30 PM",
            "citizen": "Pedro Villanueva",
            "contact": "+63 924 890 1234",
            "status": "pending"
        }
    ];

    localStorage.setItem('zc_reports', JSON.stringify(reports));
    console.log('✅ Successfully created 8 sample reports in localStorage!');
    console.log('📊 Stats: 5 pending, 2 approved, 1 rejected');
    console.log('🔄 Refresh your ZamboCollect pages to see the reports.');
})();