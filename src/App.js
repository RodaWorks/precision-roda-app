import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Search, Filter, Bell, BarChart3, Wrench, Clock, CheckCircle, AlertCircle, Users, DollarSign, TrendingUp, Camera, FileText, Phone, Mail, MapPin, Eye, Edit, Save, X, Trash2 } from 'lucide-react';

const EnhancedWheelApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showJobModal, setShowJobModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [draggedJob, setDraggedJob] = useState(null);
  
  const [jobs, setJobs] = useState([
    { id: 'P967c', customer: 'Rod meilak', service: 'Cosmetic Paint', status: 'Received', dateIn: '2025-07-14', dateOut: '', jobNo: 'JOB001', units: 4, make: 'Simmons', rimSize: '15', priority: 'normal', value: 450, comments: 'Customer wants gloss black finish' },
    { id: 'P122', customer: 'Westons Smash Repairs', service: 'Cosmetic Paint', status: 'In Progress', dateIn: '2025-07-25', dateOut: '', jobNo: 'JOB002', units: 4, make: 'Toyota', rimSize: '18', priority: 'high', value: 680, comments: 'Rush job - needed by Friday' },
    { id: 'P367d', customer: 'D&G Smash Repairs', service: 'Cosmetic CNC', status: 'Repair', dateIn: '2025-07-29', dateOut: '', jobNo: 'JOB003', units: 1, make: 'Toyota', rimSize: '18', priority: 'normal', value: 320, comments: 'Deep scratches on rim face' },
    { id: 'P64f', customer: 'Westlakes Paint & Panel', service: 'Cosmetic CNC', status: 'Finish', dateIn: '2025-08-05', dateOut: '', jobNo: 'JOB004', units: 1, make: 'Hyundai', rimSize: '18', priority: 'low', value: 290, comments: 'Standard refurbishment' },
    { id: 'Pfe8', customer: 'Shipton Smash', service: 'Cosmetic CNC', status: 'Ready', dateIn: '2025-08-05', dateOut: '2025-08-08', jobNo: 'JOB005', units: 1, make: 'LDV', rimSize: '17', priority: 'normal', value: 310, comments: 'Customer notified - ready for pickup' }
  ]);

  const [customers, setCustomers] = useState([
    { id: 1, name: 'Rod meilak', phone: '0412 345 678', email: 'rod@example.com', address: '123 Main St, Sydney' },
    { id: 2, name: 'Westons Smash Repairs', phone: '02 9876 5432', email: 'contact@westons.com.au', address: '456 Industrial Ave, Sydney' },
    { id: 3, name: 'D&G Smash Repairs', phone: '02 8765 4321', email: 'info@dgsmash.com.au', address: '789 Workshop Rd, Sydney' },
    { id: 4, name: 'Westlakes Paint & Panel', phone: '02 7654 3210', email: 'jobs@westlakes.com.au', address: '321 Paint St, Sydney' },
    { id: 5, name: 'Shipton Smash', phone: '02 6543 2109', email: 'admin@shiptonsmash.com.au', address: '654 Repair Ave, Sydney' }
  ]);

  const [newJob, setNewJob] = useState({
    customer: '',
    service: 'Cosmetic Paint',
    status: 'Received',
    dateIn: new Date().toISOString().split('T')[0],
    dateOut: '',
    jobNo: '',
    units: 1,
    make: '',
    rimSize: '',
    priority: 'normal',
    value: 0,
    comments: ''
  });

  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

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

  const serviceOptions = ['Cosmetic Paint', 'Cosmetic CNC', 'Structural Repair', 'Polish Only'];
  const makeOptions = ['Toyota', 'Holden', 'Ford', 'Mercedes', 'BMW', 'Audi', 'Hyundai', 'Mazda', 'Subaru', 'LDV', 'Simmons', 'Other'];
  const rimSizeOptions = ['15', '16', '17', '18', '19', '20', '21', '22'];

  const generateJobId = () => {
    return 'P' + Math.random().toString(36).substr(2, 4);
  };

  const generateJobNo = () => {
    const lastJobNo = Math.max(...jobs.map(job => parseInt(job.jobNo.replace('JOB', '')) || 0), 0);
    return `JOB${String(lastJobNo + 1).padStart(3, '0')}`;
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.jobNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || job.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddJob = () => {
    const jobId = generateJobId();
    const jobNo = generateJobNo();
    const jobToAdd = {
      ...newJob,
      id: jobId,
      jobNo: jobNo
    };
    
    setJobs([...jobs, jobToAdd]);
    setNewJob({
      customer: '',
      service: 'Cosmetic Paint',
      status: 'Received',
      dateIn: new Date().toISOString().split('T')[0],
      dateOut: '',
      jobNo: '',
      units: 1,
      make: '',
      rimSize: '',
      priority: 'normal',
      value: 0,
      comments: ''
    });
    setShowJobModal(false);
    alert(`Job ${jobId} created successfully!`);
  };

  const handleEditJob = (job) => {
    setEditingJob({ ...job });
  };

  const handleSaveEdit = () => {
    setJobs(jobs.map(job => job.id === editingJob.id ? editingJob : job));
    setEditingJob(null);
    alert('Job updated successfully!');
  };

  const handleDeleteJob = (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      setJobs(jobs.filter(job => job.id !== jobId));
      alert('Job deleted successfully!');
    }
  };

  const handleAddCustomer = () => {
    const customerId = Math.max(...customers.map(c => c.id)) + 1;
    setCustomers([...customers, { ...newCustomer, id: customerId }]);
    setNewCustomer({ name: '', phone: '', email: '', address: '' });
    setShowCustomerModal(false);
    alert('Customer added successfully!');
  };

  const handleStatusChange = (jobId, newStatus) => {
    setJobs(jobs.map(job => {
      if (job.id === jobId) {
        const updatedJob = { ...job, status: newStatus };
        if (newStatus === 'Ready' && !job.dateOut) {
          updatedJob.dateOut = new Date().toISOString().split('T')[0];
        }
        return updatedJob;
      }
      return job;
    }));
  };

  // Drag and Drop functionality
  const handleDragStart = (e, job) => {
    setDraggedJob(job);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    if (draggedJob && draggedJob.status !== newStatus) {
      handleStatusChange(draggedJob.id, newStatus);
      alert(`Job ${draggedJob.id} moved to ${newStatus}`);
    }
    setDraggedJob(null);
  };

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

  // Modal Components
  const JobModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Add New Job</h2>
            <button onClick={() => setShowJobModal(false)} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Customer</label>
              <select
                value={newJob.customer}
                onChange={(e) => setNewJob({...newJob, customer: e.target.value})}
                className="w-full border rounded-lg px-3 py-2"
                required
              >
                <option value="">Select Customer</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.name}>{customer.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Service</label>
              <select
                value={newJob.service}
                onChange={(e) => setNewJob({...newJob, service: e.target.value})}
                className="w-full border rounded-lg px-3 py-2"
              >
                {serviceOptions.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Make</label>
              <select
                value={newJob.make}
                onChange={(e) => setNewJob({...newJob, make: e.target.value})}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Select Make</option>
                {makeOptions.map(make => (
                  <option key={make} value={make}>{make}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Rim Size</label>
              <select
                value={newJob.rimSize}
                onChange={(e) => setNewJob({...newJob, rimSize: e.target.value})}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Select Size</option>
                {rimSizeOptions.map(size => (
                  <option key={size} value={size}>{size}"</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Units</label>
              <input
                type="number"
                min="1"
                value={newJob.units}
                onChange={(e) => setNewJob({...newJob, units: parseInt(e.target.value)})}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Value ($)</label>
              <input
                type="number"
                min="0"
                value={newJob.value}
                onChange={(e) => setNewJob({...newJob, value: parseFloat(e.target.value)})}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <select
                value={newJob.priority}
                onChange={(e) => setNewJob({...newJob, priority: e.target.value})}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Date In</label>
              <input
                type="date"
                value={newJob.dateIn}
                onChange={(e) => setNewJob({...newJob, dateIn: e.target.value})}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Comments</label>
            <textarea
              value={newJob.comments}
              onChange={(e) => setNewJob({...newJob, comments: e.target.value})}
              className="w-full border rounded-lg px-3 py-2 h-20"
              placeholder="Add any notes or special instructions..."
            />
          </div>
        </div>
        
        <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
          <button
            onClick={() => setShowJobModal(false)}
            className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleAddJob}
            disabled={!newJob.customer || !newJob.make}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Create Job
          </button>
        </div>
      </div>
    </div>
  );

  const CustomerModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Add New Customer</h2>
            <button onClick={() => setShowCustomerModal(false)} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Customer Name</label>
            <input
              type="text"
              value={newCustomer.name}
              onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Enter customer name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="tel"
              value={newCustomer.phone}
              onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="0412 345 678"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={newCustomer.email}
              onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="customer@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <textarea
              value={newCustomer.address}
              onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
              className="w-full border rounded-lg px-3 py-2 h-20"
              placeholder="Enter full address"
            />
          </div>
        </div>
        
        <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
          <button
            onClick={() => setShowCustomerModal(false)}
            className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleAddCustomer}
            disabled={!newCustomer.name}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Add Customer
          </button>
        </div>
      </div>
    </div>
  );

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
            <button 
              onClick={() => setShowJobModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
            >
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
          
          <button 
            onClick={() => setShowJobModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            <span>New Job</span>
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredJobs.map(job => {
          const StatusIcon = statusConfig[job.status].icon;
          const isEditing = editingJob && editingJob.id === job.id;
          
          return (
            <div key={job.id} className={`bg-white rounded-xl shadow-sm border-l-4 ${priorityColors[job.priority]} p-6 hover:shadow-md transition-shadow`}>
              {isEditing ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-blue-600">{job.id}</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveEdit}
                        className="p-2 text-green-600 hover:bg-green-100 rounded"
                      >
                        <Save size={20} />
                      </button>
                      <button
                        onClick={() => setEditingJob(null)}
                        className="p-2 text-gray-400 hover:bg-gray-100 rounded"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Status</label>
                      <select
                        value={editingJob.status}
                        onChange={(e) => setEditingJob({...editingJob, status: e.target.value})}
                        className="w-full border rounded px-2 py-1"
                      >
                        {Object.keys(statusConfig).map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Priority</label>
                      <select
                        value={editingJob.priority}
                        onChange={(e) => setEditingJob({...editingJob, priority: e.target.value})}
                        className="w-full border rounded px-2 py-1"
                      >
                        <option value="low">Low</option>
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Value ($)</label>
                      <input
                        type="number"
                        value={editingJob.value}
                        onChange={(e) => setEditingJob({...editingJob, value: parseFloat(e.target.value)})}
                        className="w-full border rounded px-2 py-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Comments</label>
                    <textarea
                      value={editingJob.comments}
                      onChange={(e) => setEditingJob({...editingJob, comments: e.target.value})}
                      className="w-full border rounded px-2 py-1 h-16"
                    />
                  </div>
                </div>
              ) : (
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
                        <p className="text-
