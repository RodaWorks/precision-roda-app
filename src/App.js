import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Search, Filter, Bell, BarChart3, Wrench, Clock, CheckCircle, AlertCircle, Users, DollarSign, TrendingUp, Camera, FileText, Phone, Mail, MapPin, Eye, Edit, Save, X, Trash2, ArrowLeft, Map } from 'lucide-react';

const EnhancedWheelApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showJobModal, setShowJobModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [draggedJob, setDraggedJob] = useState(null);
  
  const [jobs, setJobs] = useState([
    { id: 'P967c', customer: 'Rod meilak', service: 'Cosmetic Paint', status: 'Received', dateIn: '2025-07-14', dateOut: '', jobNo: 'JOB001', units: 4, make: 'Simmons', rimSize: '15', priority: 'normal', value: 450, comments: 'Customer wants gloss black finish' },
    { id: 'P122', customer: 'Westons Smash Repairs', service: 'Cosmetic Paint', status: 'In Progress', dateIn: '2025-07-25', dateOut: '', jobNo: 'JOB002', units: 4, make: 'Toyota', rimSize: '18', priority: 'high', value: 680, comments: 'Rush job - needed by Friday' },
    { id: 'P367d', customer: 'D&G Smash Repairs', service: 'Cosmetic CNC', status: 'Repair', dateIn: '2025-07-29', dateOut: '', jobNo: 'JOB003', units: 1, make: 'Toyota', rimSize: '18', priority: 'normal', value: 320, comments: 'Deep scratches on rim face' },
    { id: 'P64f', customer: 'Westlakes Paint & Panel', service: 'Cosmetic CNC', status: 'Finish', dateIn: '2025-08-05', dateOut: '', jobNo: 'JOB004', units: 1, make: 'Hyundai', rimSize: '18', priority: 'low', value: 290, comments: 'Standard refurbishment' },
    { id: 'Pfe8', customer: 'Shipton Smash', service: 'Cosmetic CNC', status: 'Ready', dateIn: '2025-08-05', dateOut: '2025-08-08', jobNo: 'JOB005', units: 1, make: 'LDV', rimSize: '17', priority: 'normal', value: 310, comments: 'Customer notified - ready for pickup' }
  ]);

  const [customers, setCustomers] = useState([
    { 
      id: 1, 
      name: 'Rod meilak', 
      phone: '0412 345 678', 
      email: 'rod@example.com', 
      fullName: 'Rod Meilak',
      billingAddress: '123 Main St, Surry Hills, NSW 2010',
      shippingAddress: '123 Main St, Surry Hills, NSW 2010',
      trade: true,
      run: 'North',
      coordinates: { lat: -33.8886, lng: 151.2094 }
    },
    { 
      id: 2, 
      name: 'Westons Smash Repairs', 
      phone: '02 9876 5432', 
      email: 'contact@westons.com.au',
      fullName: 'Westons Smash Repairs Pty Ltd',
      billingAddress: '456 Industrial Ave, Alexandria, NSW 2015',
      shippingAddress: '456 Industrial Ave, Alexandria, NSW 2015',
      trade: true,
      run: 'South',
      coordinates: { lat: -33.9067, lng: 151.1957 }
    },
    { 
      id: 3, 
      name: 'D&G Smash Repairs', 
      phone: '02 8765 4321', 
      email: 'info@dgsmash.com.au',
      fullName: 'D&G Smash Repairs',
      billingAddress: '789 Workshop Rd, Blacktown, NSW 2148',
      shippingAddress: '789 Workshop Rd, Blacktown, NSW 2148',
      trade: true,
      run: 'West',
      coordinates: { lat: -33.7715, lng: 150.9058 }
    },
    { 
      id: 4, 
      name: 'Westlakes Paint & Panel', 
      phone: '02 7654 3210', 
      email: 'jobs@westlakes.com.au',
      fullName: 'Westlakes Paint & Panel Services',
      billingAddress: '321 Paint St, Mt Druitt, NSW 2770',
      shippingAddress: '321 Paint St, Mt Druitt, NSW 2770',
      trade: true,
      run: 'West',
      coordinates: { lat: -33.7683, lng: 150.8203 }
    },
    { 
      id: 5, 
      name: 'Shipton Smash', 
      phone: '02 6543 2109', 
      email: 'admin@shiptonsmash.com.au',
      fullName: 'Shipton Smash Repairs',
      billingAddress: '654 Repair Ave, Bankstown, NSW 2200',
      shippingAddress: '654 Repair Ave, Bankstown, NSW 2200',
      trade: true,
      run: 'South',
      coordinates: { lat: -33.9185, lng: 151.0327 }
    }
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
    fullName: '',
    billingAddress: '',
    shippingAddress: '',
    trade: false,
    run: 'North'
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
  const runOptions = ['North', 'South', 'East', 'West'];

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

  const getCustomerJobs = (customerName) => {
    return jobs.filter(job => job.customer === customerName);
  };

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
    const customerToAdd = {
      ...newCustomer,
      id: customerId,
      coordinates: { lat: -33.8688, lng: 151.2093 } // Default Sydney coordinates
    };
    setCustomers([...customers, customerToAdd]);
    setNewCustomer({
      name: '',
      phone: '',
      email: '',
      fullName: '',
      billingAddress: '',
      shippingAddress: '',
      trade: false,
      run: 'North'
    });
    setShowCustomerModal(false);
    alert('Customer added successfully!');
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer({ ...customer });
  };

  const handleSaveCustomerEdit = () => {
    setCustomers(customers.map(customer => 
      customer.id === editingCustomer.id ? editingCustomer : customer
    ));
    
    // Update jobs with new customer name if it changed
    if (editingCustomer.name !== customers.find(c => c.id === editingCustomer.id)?.name) {
      const oldName = customers.find(c => c.id === editingCustomer.id)?.name;
      setJobs(jobs.map(job => 
        job.customer === oldName ? { ...job, customer: editingCustomer.name } : job
      ));
    }
    
    setEditingCustomer(null);
    alert('Customer updated successfully!');
  };

  const handleDeleteCustomer = (customerId) => {
    const customer = customers.find(c => c.id === customerId);
    const customerJobs = getCustomerJobs(customer.name);
    
    if (customerJobs.length > 0) {
      alert(`Cannot delete customer with active jobs. Please complete or reassign ${customerJobs.length} job(s) first.`);
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setCustomers(customers.filter(customer => customer.id !== customerId));
      alert('Customer deleted successfully!');
    }
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

  // Touch and Drag functionality for mobile and desktop
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Desktop drag and drop
  const handleDragStart = (e, job) => {
    setDraggedJob(job);
    setIsDragging(true);
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
    setIsDragging(false);
  };

  // Touch events for mobile
  const handleTouchStart = (e, job) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
    setDraggedJob(job);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    setTouchEnd({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
  };

  const handleTouchEnd = (e, newStatus) => {
    if (!touchStart || !touchEnd || !draggedJob) {
      setDraggedJob(null);
      setIsDragging(false);
      return;
    }

    // Calculate distance moved
    const deltaX = Math.abs(touchEnd.x - touchStart.x);
    const deltaY = Math.abs(touchEnd.y - touchStart.y);
    
    // Only trigger if moved significantly (not just a tap)
    if (deltaX > 50 || deltaY > 50) {
      if (draggedJob.status !== newStatus) {
        handleStatusChange(draggedJob.id, newStatus);
        alert(`Job ${draggedJob.id} moved to ${newStatus}`);
      }
    }
    
    setDraggedJob(null);
    setTouchStart(null);
    setTouchEnd(null);
    setIsDragging(false);
  };

  // Alternative: Simple button-based status change for mobile
  const handleMobileStatusChange = (job) => {
    const statusOrder = ['Received', 'Repair', 'Finish', 'Ready'];
    const currentIndex = statusOrder.indexOf(job.status);
    const nextIndex = (currentIndex + 1) % statusOrder.length;
    const newStatus = statusOrder[nextIndex];
    
    handleStatusChange(job.id, newStatus);
    alert(`Job ${job.id} moved to ${newStatus}`);
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

  // Map Modal Component
  const MapModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Customer & Job Locations</h2>
            <button onClick={() => setShowMapModal(false)} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <Map size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">Interactive Map would display here</p>
              <p className="text-sm text-gray-500">Showing customer locations and active job sites</p>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Customer Locations</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {customers.map(customer => (
                  <div key={customer.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium">{customer.name}</span>
                    <span className="text-xs text-gray-500">{customer.run} Run</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Active Jobs by Location</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {jobs.filter(job => job.status !== 'Ready').map(job => {
                  const customer = customers.find(c => c.name === job.customer);
                  return (
                    <div key={job.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">{job.id}</span>
                      <span className="text-xs text-gray-500">{customer?.run || 'Unknown'} Run</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Add New Customer</h2>
            <button onClick={() => setShowCustomerModal(false)} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                value={newCustomer.fullName}
                onChange={(e) => setNewCustomer({...newCustomer, fullName: e.target.value})}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Full business/legal name"
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
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Billing Address</label>
              <textarea
                value={newCustomer.billingAddress}
                onChange={(e) => setNewCustomer({...newCustomer, billingAddress: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 h-20"
                placeholder="Enter full billing address"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Shipping Address</label>
              <textarea
                value={newCustomer.shippingAddress}
                onChange={(e) => setNewCustomer({...newCustomer, shippingAddress: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 h-20"
                placeholder="Enter full shipping address (if different from billing)"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Run</label>
              <select
                value={newCustomer.run}
                onChange={(e) => setNewCustomer({...newCustomer, run: e.target.value})}
                className="w-full border rounded-lg px-3 py-2"
              >
                {runOptions.map(run => (
                  <option key={run} value={run}>{run}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="trade"
                checked={newCustomer.trade}
                onChange={(e) => setNewCustomer({...newCustomer, trade: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="trade" className="text-sm font-medium">Trade Customer</label>
            </div>
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

  // Customer Detail View Component
  const CustomerDetailView = () => {
    const customer = selectedCustomer;
    const customerJobs = getCustomerJobs(customer.name);
    const isEditing = editingCustomer && editingCustomer.id === customer.id;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSelectedCustomer(null)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">{customer.name}</h1>
          </div>
          
          <div className="flex space-x-3">
            <button 
              onClick={() => setShowMapModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors"
            >
              <Map size={20} />
              <span>View on Map</span>
            </button>
            <button 
              onClick={() => {
                setNewJob({...newJob, customer: customer.name});
                setShowJobModal(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              <span>New Job</span>
            </button>
          </div>
        </div>

        {/* Customer Details Card */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          {isEditing ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Edit Customer Details</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveCustomerEdit}
                    className="p-2 text-green-600 hover:bg-green-100 rounded"
                  >
                    <Save size={20} />
                  </button>
                  <button
                    onClick={() => setEditingCustomer(null)}
                    className="p-2 text-gray-400 hover:bg-gray-100 rounded"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Customer Name</label>
                  <input
                    type="text"
                    value={editingCustomer.name}
                    onChange={(e) => setEditingCustomer({...editingCustomer, name: e.target.value})}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editingCustomer.fullName}
                    onChange={(e) => setEditingCustomer({...editingCustomer, fullName: e.target.value})}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="tel"
                    value={editingCustomer.phone}
                    onChange={(e) => setEditingCustomer({...editingCustomer, phone: e.target.value})}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={editingCustomer.email}
                    onChange={(e) => setEditingCustomer({...editingCustomer, email: e.target.value})}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Billing Address</label>
                  <textarea
                    value={editingCustomer.billingAddress}
                    onChange={(e) => setEditingCustomer({...editingCustomer, billingAddress: e.target.value})}
                    className="w-full border rounded px-2 py-1 h-16"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Shipping Address</label>
                  <textarea
                    value={editingCustomer.shippingAddress}
                    onChange={(e) => setEditingCustomer({...editingCustomer, shippingAddress: e.target.value})}
                    className="w-full border rounded px-2 py-1 h-16"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Run</label>
                  <select
                    value={editingCustomer.run}
                    onChange={(e) => setEditingCustomer({...editingCustomer, run: e.target.value})}
                    className="w-full border rounded px-2 py-1"
                  >
                    {runOptions.map(run => (
                      <option key={run} value={run}>{run}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="editTrade"
                    checked={editingCustomer.trade}
                    onChange={(e) => setEditingCustomer({...editingCustomer, trade: e.target.checked})}
                    className="mr-2"
                  />
                  <label htmlFor="editTrade" className="text-sm font-medium">Trade Customer</label>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-semibold">Customer Details</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditCustomer(customer)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Edit Customer"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteCustomer(customer.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete Customer"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Users size={16} className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Display Name</p>
                        <p className="font-medium">{customer.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText size={16} className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Full Name</p>
                        <p className="font-medium">{customer.fullName}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone size={16} className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium">{customer.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail size={16} className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{customer.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Billing Address</h3>
                  <div className="flex items-start space-x-2">
                    <MapPin size={16} className="text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-medium">{customer.billingAddress}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Business Details</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Run</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        customer.run === 'North' ? 'bg-blue-100 text-blue-800' :
                        customer.run === 'South' ? 'bg-green-100 text-green-800' :
                        customer.run === 'East' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {customer.run} Run
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Customer Type</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        customer.trade ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {customer.trade ? 'Trade Customer' : 'Retail Customer'}
                      </span>
                    </div>
                    {customer.shippingAddress && customer.shippingAddress !== customer.billingAddress && (
                      <div>
                        <p className="text-sm text-gray-600">Shipping Address</p>
                        <p className="text-sm text-gray-900">{customer.shippingAddress}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Customer Jobs */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Jobs for {customer.name}</h2>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {customerJobs.length} total jobs • ${customerJobs.reduce((sum, job) => sum + job.value, 0).toLocaleString()} total value
              </span>
            </div>
          </div>
          
          {customerJobs.length === 0 ? (
            <div className="text-center py-8">
              <Wrench size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 mb-4">No jobs found for this customer</p>
              <button 
                onClick={() => {
                  setNewJob({...newJob, customer: customer.name});
                  setShowJobModal(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create First Job
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {customerJobs.map(job => {
                const StatusIcon = statusConfig[job.status].icon;
                return (
                  <div key={job.id} className={`bg-gray-50 rounded-lg border-l-4 ${priorityColors[job.priority]} p-4 hover:bg-gray-100 transition-colors`}>
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-lg font-bold text-blue-600">{job.id}</span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig[job.status].color}`}>
                            <StatusIcon className="inline w-4 h-4 mr-1" />
                            {job.status}
                          </span>
                          {job.priority === 'high' && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">HIGH PRIORITY</span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Service</p>
                            <p className="font-medium">{job.service}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Vehicle</p>
                            <p className="font-medium">{job.make} - {job.rimSize}"</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Value</p>
                            <p className="font-medium">${job.value}</p>
                          </div>
                        </div>
                        
                        {job.comments && (
                          <div className="mt-3 p-3 bg-white rounded-lg">
                            <p className="text-sm text-gray-700">{job.comments}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Date In</p>
                          <p className="font-medium">{job.dateIn}</p>
                          {job.dateOut && (
                            <>
                              <p className="text-sm text-gray-600 mt-1">Date Out</p>
                              <p className="font-medium">{job.dateOut}</p>
                            </>
                          )}
                        </div>
                        <button 
                          onClick={() => handleEditJob(job)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Edit Job"
                        >
                          <Edit size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
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
            <button 
              onClick={() => setShowMapModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors"
            >
              <Map size={20} />
              <span>View Map</span>
            </button>
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
                        <p className="text-gray-600">Customer</p>
                        <button 
                          onClick={() => setSelectedCustomer(customers.find(c => c.name === job.customer))}
                          className="font-medium text-blue-600 hover:text-blue-800 underline"
                        >
                          {job.customer}
                        </button>
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
                    
                    {job.comments && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{job.comments}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Date In</p>
                      <p className="font-medium">{job.dateIn}</p>
                      {job.dateOut && (
                        <>
                          <p className="text-sm text-gray-600 mt-1">Date Out</p>
                          <p className="font-medium">{job.dateOut}</p>
                        </>
                      )}
                    </div>
                    <div className="flex flex-col space-y-2">
                      <button 
                        onClick={() => handleEditJob(job)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit Job"
                      >
                        <Edit size={20} />
                      </button>
                      <button 
                        onClick={() => handleDeleteJob(job.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete Job"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const KanbanView = () => {
    const statusColumns = ['Received', 'Repair', 'Finish', 'Ready'];
    const isMobile = window.innerWidth <= 768;
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Job Kanban</h1>
          <button 
            onClick={() => setShowJobModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            <span>New Job</span>
          </button>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p className="text-yellow-800 text-sm">
            💡 <strong>Tip:</strong> {isMobile ? 'Tap the status button on job cards to move them between stages!' : 'Drag jobs between columns to update their status!'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-screen">
          {statusColumns.map(status => {
            const statusJobs = jobs.filter(job => job.status === status);
            const StatusIcon = statusConfig[status].icon;
            
            return (
              <div 
                key={status} 
                className="bg-gray-50 rounded-xl p-4"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, status)}
                onTouchEnd={(e) => handleTouchEnd(e, status)}
              >
                <div className={`flex items-center space-x-2 mb-4 p-3 rounded-lg ${statusConfig[status].color}`}>
                  <StatusIcon size={20} />
                  <h3 className="font-semibold">{status}</h3>
                  <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">
                    {statusJobs.length}
                  </span>
                </div>
                
                <div className="space-y-3">
                  {statusJobs.map(job => {
                    const statusOrder = ['Received', 'Repair', 'Finish', 'Ready'];
                    const currentIndex = statusOrder.indexOf(job.status);
                    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
                    
                    return (
                      <div 
                        key={job.id} 
                        draggable={!isMobile}
                        onDragStart={!isMobile ? (e) => handleDragStart(e, job) : undefined}
                        onTouchStart={isMobile ? (e) => handleTouchStart(e, job) : undefined}
                        onTouchMove={isMobile ? handleTouchMove : undefined}
                        className={`bg-white rounded-lg p-4 shadow-sm border-l-4 ${priorityColors[job.priority]} ${
                          !isMobile ? 'cursor-grab hover:shadow-md active:cursor-grabbing' : 'hover:shadow-md'
                        } transition-shadow ${isDragging && draggedJob?.id === job.id ? 'opacity-50' : ''}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-bold text-blue-600">{job.id}</span>
                          {job.priority === 'high' && (
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                          )}
                        </div>
                        <button 
                          onClick={() => setSelectedCustomer(customers.find(c => c.name === job.customer))}
                          className="text-sm font-medium text-gray-900 mb-1 hover:text-blue-600 underline"
                        >
                          {job.customer}
                        </button>
                        <p className="text-xs text-gray-600 mb-2">{job.service}</p>
                        <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                          <span>{job.units} wheels</span>
                          <span>${job.value}</span>
                        </div>
                        <div className="pt-2 border-t">
                          <p className="text-xs text-gray-500 mb-2">{job.dateIn}</p>
                          
                          {/* Mobile: Status change button */}
                          {isMobile && job.status !== 'Ready' && (
                            <button
                              onClick={() => handleMobileStatusChange(job)}
                              className={`w-full py-2 px-3 rounded text-xs font-medium transition-colors ${
                                statusConfig[nextStatus].color
                              } hover:opacity-80`}
                            >
                              Move to {nextStatus} →
                            </button>
                          )}
                          
                          {/* Desktop: Edit button */}
                          {!isMobile && (
                            <button
                              onClick={() => handleEditJob(job)}
                              className="text-xs text-gray-500 hover:text-blue-600 transition-colors"
                            >
                              Edit Job
                            </button>
                          )}
                        </div>
                        
                        {job.comments && (
                          <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                            {job.comments.length > 50 ? job.comments.substring(0, 50) + '...' : job.comments}
                          </div>
                        )}
                      </div>
                    );
                  })}
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
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowMapModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors"
          >
            <Map size={20} />
            <span>View Map</span>
          </button>
          <button 
            onClick={() => setShowCustomerModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {customers.map(customer => {
          const customerJobs = getCustomerJobs(customer.name);
          const activeJobs = customerJobs.filter(job => job.status !== 'Ready');
          const completedJobs = customerJobs.filter(job => job.status === 'Ready');
          const totalValue = customerJobs.reduce((sum, job) => sum + job.value, 0);
          
          return (
            <div key={customer.id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{customer.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      customer.trade ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {customer.trade ? 'Trade' : 'Retail'}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      customer.run === 'North' ? 'bg-blue-100 text-blue-800' :
                      customer.run === 'South' ? 'bg-green-100 text-green-800' :
                      customer.run === 'East' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {customer.run} Run
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
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
                      <span className="truncate">{customer.billingAddress}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Total Jobs</p>
                      <p className="font-bold text-lg">{customerJobs.length}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Active Jobs</p>
                      <p className="font-bold text-lg text-blue-600">{activeJobs.length}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Completed</p>
                      <p className="font-bold text-lg text-green-600">{completedJobs.length}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Total Value</p>
                      <p className="font-bold text-lg text-purple-600">${totalValue.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => setSelectedCustomer(customer)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="View Customer Details"
                  >
                    <Eye size={20} />
                  </button>
                  <button 
                    onClick={() => handleEditCustomer(customer)}
                    className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                    title="Edit Customer"
                  >
                    <Edit size={20} />
                  </button>
                  <button 
                    onClick={() => handleDeleteCustomer(customer.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete Customer"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
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
        <h2 className="text-xl font-semibold mb-4">Upcoming Deadlines</h2>
        <div className="space-y-3">
          {jobs.filter(job => job.status !== 'Ready').map(job => (
            <div key={job.id} className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <button 
                  onClick={() => setSelectedCustomer(customers.find(c => c.name === job.customer))}
                  className="font-medium hover:text-blue-600 underline"
                >
                  {job.id} - {job.customer}
                </button>
                <span className={`ml-2 px-2 py-1 rounded text-xs ${statusConfig[job.status].color}`}>
                  {job.status}
                </span>
              </div>
              <span className="text-sm text-gray-500">{job.dateIn}</span>
            </div>
          ))}
        </div>
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
    if (selectedCustomer) {
      return <CustomerDetailView />;
    }
    
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
                  onClick={() => {
                    setActiveTab(item.id);
                    setSelectedCustomer(null); // Reset customer detail view
                  }}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === item.id && !selectedCustomer
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

      {/* Modals */}
      {showJobModal && <JobModal />}
      {showCustomerModal && <CustomerModal />}
      {showMapModal && <MapModal />}
    </div>
  );
};

export default EnhancedWheelApp;
