import React, { useState } from 'react';
import OneUIHeader from './OneUIHeader';
import { Icons } from '../constants';

interface ScamReport {
  id: number;
  reportedNumber: string;
  bankName: string;
  accountId: string;
  reportDate: string;
  similarReports: number;
  status: 'verified' | 'investigating' | 'resolved';
}

interface ScamProtectAppProps {
  scrolled: boolean;
}

const ScamProtectApp: React.FC<ScamProtectAppProps> = ({ scrolled }) => {
  // Mock data - in real app, this would come from backend/database
  const [todayReports] = useState(247);
  const [myReports] = useState<ScamReport[]>([
    {
      id: 1,
      reportedNumber: '+1 555 123 4567',
      bankName: 'Bank A',
      accountId: '1234-5678-9012',
      reportDate: '2026-01-04 14:30',
      similarReports: 156,
      status: 'verified'
    },
    {
      id: 2,
      reportedNumber: '+66 2 123 4567',
      bankName: 'Bank A',
      accountId: '9876-5432-1098',
      reportDate: '2026-01-03 09:15',
      similarReports: 89,
      status: 'investigating'
    },
    {
      id: 3,
      reportedNumber: '+1 800 555 0199',
      bankName: 'Bank B',
      accountId: '5555-6666-7777',
      reportDate: '2026-01-02 16:45',
      similarReports: 203,
      status: 'verified'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-red-100 text-red-700';
      case 'investigating': return 'bg-yellow-100 text-yellow-700';
      case 'resolved': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'verified': return 'Verified Scam';
      case 'investigating': return 'Investigating';
      case 'resolved': return 'Resolved';
      default: return status;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative overflow-hidden">
      <div className="flex-1 overflow-y-auto pt-16 pb-6">
        {/* Dashboard Header */}
        <div className="px-6 pt-6 pb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-sm text-gray-500">Real-time scam protection statistics</p>
        </div>

        {/* Statistics Cards */}
        <div className="px-6 space-y-4 mb-6">
          {/* Today's Reports Card */}
          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-[2rem] p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium mb-1">Reports Today</p>
                <h3 className="text-4xl font-bold text-white">{todayReports}</h3>
                <p className="text-white/70 text-xs mt-2">↑ 23% from yesterday</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 6h2v2h-2V7zm0 4h2v6h-2v-6z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* My Reports Card */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-[2rem] p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium mb-1">My Reports</p>
                <h3 className="text-4xl font-bold text-white">{myReports.length}</h3>
                <p className="text-white/70 text-xs mt-2">You helped protect others</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8">
                  <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* My Reports List */}
        <div className="px-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">My Report History</h3>
          <div className="space-y-3">
            {myReports.map((report) => (
              <div 
                key={report.id} 
                className="bg-white rounded-[1.5rem] border border-gray-200 shadow-sm p-4 active:bg-gray-50 transition-colors"
              >
                {/* Report Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-sm mb-1">{report.reportedNumber}</p>
                    <p className="text-xs text-gray-500">{report.reportDate}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(report.status)}`}>
                    {getStatusLabel(report.status)}
                  </span>
                </div>

                {/* Bank Info */}
                <div className="bg-gray-50 rounded-xl p-3 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-600">Bank:</span>
                    <span className="text-xs font-bold text-gray-900">{report.bankName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-600">Account:</span>
                    <span className="text-xs font-mono font-bold text-gray-900">{report.accountId}</span>
                  </div>
                </div>

                {/* Similar Reports Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Community Reports</span>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 bg-orange-50 px-3 py-1.5 rounded-full">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-orange-500">
                        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                      </svg>
                      <span className="text-xs font-bold text-orange-700">{report.similarReports}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Padding */}
        <div className="h-6"></div>
      </div>
    </div>
  );
};

export default ScamProtectApp;
