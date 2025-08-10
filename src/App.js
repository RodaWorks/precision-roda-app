import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Search, Filter, Bell, BarChart3, Wrench, Clock, CheckCircle, AlertCircle, Users, DollarSign, TrendingUp, Camera, FileText, Phone, Mail, MapPin, Eye } from 'lucide-react';

const EnhancedWheelApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [jobs, setJobs] = useState([
    { id: 'P967c', customer: 'Rod meilak', service: 'Cosmetic Paint', status: 'Received', dateIn: '2025-07-14', units: 4, make: 'Simmons', rimSize: '15', priority: 'normal', value: 450 },
    { id: 'P122', customer: 'Westons Smash Repairs', service: 'Cosmetic Paint', status: 'In Progress', dateIn: '2025-07-25', units: 4, make: 'Toyota', rimSize: '18', priority: 'high', value: 680 },
    { id: 'P367d', customer: 'D&G Smash Repairs', service: 'Cosmetic CNC', status: 'Repair', dateIn: '2025-07-29', units: 1, make: 'Toyota', rimSize: '18', priority: 'normal', value: 320 },
    { id: 'P64f', customer: 'Westlakes Paint & Panel', service: 'Cosmetic CNC', status: 'Finish', dateIn: '2025-08-05', units: 1, make: 'Hyundai', rimSize: '18', priority: 'low', value: 290 },
    { id: 'Pfe8', customer: 'Shipton Smash', service: 'Cosmetic CNC', status: 'Ready', dateIn: '2025-08-05', units: 1, make: 'LDV', rimSize: '17', priority: 'normal', value: 310 }
  ]);

  const [customers] = useState([
    { id: 1, name: 'Rod meilak', phone: '0412 345 678', email: 'rod@example.com', address: '123 Main St, Sydney' },
    { id: 2, name: 'Westons Smash Repairs', phone: '02 9876 5432', email: 'contact@westons.com.au', address: '456 Industrial Ave, Sydney' },
    { id: 3, name: 'D&G Smash Repairs', phone: '02 8765 4321', email: 'info@dgsmash.com.au', address: '789 Workshop Rd, Sydney' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const statusConfig = {
    'Received': { color: 'bg-blue-100 text-blue-800', icon: Clock },
    'In Progress': { color: 'bg-yellow-100 text-yellow-800', icon: Wrench },
    'Repair': { color: 'bg-orange-100 text-orange-800', icon: AlertCircle },
    'Finish': { color: 'bg-purple-100 text-purple-800', icon: CheckCircle },
    'Ready': { color: 'bg-green-100 text-green-800', icon: CheckCircle }
  };

  const priorityColors = {
    'high': 'border-l-red-500',
    'normal': 'border-l-blue-500',
    'low': 'border-l-gray-400'
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || job.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusCounts = () => {
    const counts = {};
    jobs.forEach(job => {
      counts[job.status] = (counts[job.status] || 0) + 1;
    });
    return counts;
  };

  const getTotalValue = () => {
    return jobs.reduce((sum, job) => sum + job.value, 0);
  };

  const getWeeklyRevenue = () => {
    const completedJobs = jobs.filter(job => job.status === 'Ready');
    return completedJobs.reduce((sum, job) => sum + job.value, 0);
  };

  const DashboardView = () => {
    const statusCounts = getStatusCounts();
    const totalJobs = jobs.length;
    const totalValue = getTotalValue();
    const weeklyRevenue = getWeeklyRevenue();

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex space-x-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors">
              <Plus size={20} />
              <span>New Job</span>
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-3xl font-bold text-gray-900">{totalJobs}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">Active pipeline</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pipeline Value</p>
                <p className="text-3xl font-bold text-gray-900">${totalValue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">Total job value</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ready for Pickup</p>
                <p className="text-3xl font-bold text-gray-900">{statusCounts['Ready'] || 0}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">Completed jobs</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Week Revenue</p>
                <p className="text-3xl font-bold text-gray-900">${weeklyRevenue.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-xs text-green-600 mt-2">↗ 12% from last week</p>
          </div>
        </div>

        {/* Status Overview */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">Job Status Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(statusCounts).map(([status, count]) => {
              const config = statusConfig[status];
              const Icon = config.icon;
              return (
                <div key={status} className={`p-4 rounded-lg ${config.color} text-center`}>
                  <Icon className="h-6 w-6 mx-auto mb-2" />
                  <p className="font-semibold text-lg">{count}</p>
                  <p className="text-xs">{status}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {jobs.slice(0, 5).map(job => (
              <div key={job.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${statusConfig[job.status].color}`}>
                    {job.status}
                  </span>
                  <span className="font-medium">{job.id}</span>
                  <span className="text-gray-600">{job.customer}</span>
                </div>
                <span className="text-sm text-gray-500">{job.dateIn}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const JobsView = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Jobs</h1>
        
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search jobs or customers..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select 
            className="px-4 py-2 border rounded-lg"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            {Object.keys(statusConfig).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors">
            <Plus size={20} />
            <span>New Job</span>
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredJobs.map(job => {
          const StatusIcon = statusConfig[job.status].icon;
          return (
            <div key={job.id} className={`bg-white rounded-xl shadow-sm border-l-4 ${priorityColors[job.priority]} p-6 hover:shadow-md transition-shadow`}>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-xl font-bold text-blue-600">{job.id}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig[job.status].color}`}>
                      <StatusIcon className="inline w-4 h-4 mr-1" />
                      {job.status}
                    </span>
                    {job.priority === 'high' && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">HIGH PRIORITY</span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Customer</p>
                      <p className="font-medium">{job.customer}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Service</p>
                      <p className="font-medium">{job.service}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Vehicle</p>
                      <p className="font-medium">{job.make} - {job.rimSize}"</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Units & Value</p>
                      <p className="font-medium">{job.units} wheels - ${job.value}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Date In</p>
                    <p className="font-medium">{job.dateIn}</p>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                    <Eye size={20} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const KanbanView = () => {
    const statusColumns = ['Received', 'Repair', 'Finish', 'Ready'];
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Job Kanban</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors">
            <Plus size={20} />
            <span>New Job</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-screen">
          {statusColumns.map(status => {
            const statusJobs = jobs.filter(job => job.status === status);
            const StatusIcon = statusConfig[status].icon;
            
            return (
              <div key={status} className="bg-gray-50 rounded-xl p-4">
                <div className={`flex items-center space-x-2 mb-4 p-3 rounded-lg ${statusConfig[status].color}`}>
                  <StatusIcon size={20} />
                  <h3 className="font-semibold">{status}</h3>
                  <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">
                    {statusJobs.length}
                  </span>
                </div>
                
                <div className="space-y-3">
                  {statusJobs.map(job => (
                    <div key={job.id} className={`bg-white rounded-lg p-4 shadow-sm border-l-4 ${priorityColors[job.priority]} cursor-pointer hover:shadow-md transition-shadow`}>
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-blue-600">{job.id}</span>
                        {job.priority === 'high' && (
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-gray-900 mb-1">{job.customer}</p>
                      <p className="text-xs text-gray-600 mb-2">{job.service}</p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>{job.units} wheels</span>
                        <span>${job.value}</span>
                      </div>
                      <div className="mt-2 pt-2 border-t">
                        <p className="text-xs text-gray-500">{job.dateIn}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const CustomersView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors">
          <Plus size={20} />
          <span>Add Customer</span>
        </button>
      </div>

      <div className="grid gap-4">
        {customers.map(customer => (
          <div key={customer.id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{customer.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Phone size={16} className="text-gray-400" />
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail size={16} className="text-gray-400" />
                    <span>{customer.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin size={16} className="text-gray-400" />
                    <span>{customer.address}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Active Jobs</p>
                  <p className="font-bold text-lg">{jobs.filter(job => job.customer === customer.name).length}</p>
                </div>
                <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                  <Eye size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const CalendarView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors">
          <Plus size={20} />
          <span>Schedule Pickup</span>
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <p className="text-gray-600 text-center py-12">Calendar integration would show scheduled pickups, deliveries, and deadlines here.</p>
      </div>
    </div>
  );

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'jobs', label: 'Jobs', icon: Wrench },
    { id: 'kanban', label: 'Kanban', icon: CheckCircle },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'calendar', label: 'Calendar', icon: Calendar }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView />;
      case 'jobs': return <JobsView />;
      case 'kanban': return <KanbanView />;
      case 'customers': return <CustomersView />;
      case 'calendar': return <CalendarView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Precision Roda</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell size={20} />
              </button>
              <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {navigationItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === item.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default EnhancedWheelApp;
