import { useAuth } from '../contexts/AuthContext';
import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  Plus, 
  Eye, 
  Edit2, 
  Trash2, 
  Search, 
  Filter,
  Download, 
  Upload, 
  Camera,
  X,
  ChevronDown,
  ChevronRight,
  UserPlus,
  Heart,
  Baby,
  Calendar,
  MapPin,
  User,
  Menu,
  Save,
  FileText,
  Home
} from 'lucide-react';

function App() {
    const { currentUser } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [currentView, setCurrentView] = useState('list');
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [addMemberType, setAddMemberType] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    gender: '',
    generation: '',
    ageRange: '',
    alive: ''
  });

  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    gender: '',
    birthPlace: '',
    marriageDate: '',
    spouse: '',
    children: '',
    parents: '',
    occupation: '',
    deathDate: '',
    biography: '',
    photo: null
  });

  const fileInputRef = useRef(null);
  const importInputRef = useRef(null);

//   useEffect(() => {
//     const savedProfiles = localStorage.getItem('familyProfiles');
//     if (savedProfiles) {
//       setProfiles(JSON.parse(savedProfiles));
//     } else {
//       loadSampleData();
//     }
//   }, []);

useEffect(() => {
  if (currentUser) {
    const savedProfiles = localStorage.getItem(`familyProfiles_${currentUser.id}`);
    if (savedProfiles) {
      setProfiles(JSON.parse(savedProfiles));
    } else {
      loadSampleData();
    }
  }
}, [currentUser]);

useEffect(() => {
  if (currentUser) {
    localStorage.setItem(`familyProfiles_${currentUser.id}`, JSON.stringify(profiles));
  }
}, [profiles, currentUser]);

  useEffect(() => {
    localStorage.setItem('familyProfiles', JSON.stringify(profiles));
  }, [profiles]);

  const loadSampleData = () => {
    const sampleData = [
      {
        id: 1,
        name: 'John Smith',
        dateOfBirth: '1920-05-15',
        gender: 'Male',
        birthPlace: 'New York, USA',
        marriageDate: '1945-06-20',
        spouse: 'Mary Johnson',
        children: ['Robert Smith', 'Susan Smith'],
        parents: [],
        occupation: 'Engineer',
        deathDate: '2005-12-10',
        biography: 'A dedicated engineer who worked on various infrastructure projects.',
        photo: null
      },
      {
        id: 2,
        name: 'Mary Johnson',
        dateOfBirth: '1925-08-22',
        gender: 'Female',
        birthPlace: 'Boston, USA',
        marriageDate: '1945-06-20',
        spouse: 'John Smith',
        children: ['Robert Smith', 'Susan Smith'],
        parents: [],
        occupation: 'Teacher',
        deathDate: null,
        biography: 'A beloved teacher who inspired many students over her 40-year career.',
        photo: null
      },
      {
        id: 3,
        name: 'Robert Smith',
        dateOfBirth: '1946-03-10',
        gender: 'Male',
        birthPlace: 'New York, USA',
        marriageDate: '1970-09-15',
        spouse: 'Linda Davis',
        children: ['Michael Smith', 'Sarah Smith'],
        parents: ['John Smith', 'Mary Johnson'],
        occupation: 'Doctor',
        deathDate: null,
        biography: 'A successful doctor who served the community for over 30 years.',
        photo: null
      },
      {
        id: 4,
        name: 'Susan Smith',
        dateOfBirth: '1948-07-22',
        gender: 'Female',
        birthPlace: 'New York, USA',
        marriageDate: '1972-05-10',
        spouse: 'James Wilson',
        children: ['Jennifer Wilson', 'David Wilson'],
        parents: ['John Smith', 'Mary Johnson'],
        occupation: 'Lawyer',
        deathDate: null,
        biography: 'A dedicated lawyer who fought for justice and equality.',
        photo: null
      }
    ];
    setProfiles(sampleData);
  };

  const calculateAge = (dateOfBirth, deathDate = null) => {
    const birth = new Date(dateOfBirth);
    const end = deathDate ? new Date(deathDate) : new Date();
    return Math.floor((end - birth) / (365.25 * 24 * 60 * 60 * 1000));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      dateOfBirth: '',
      gender: '',
      birthPlace: '',
      marriageDate: '',
      spouse: '',
      children: '',
      parents: '',
      occupation: '',
      deathDate: '',
      biography: '',
      photo: null
    });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.dateOfBirth) {
      alert('Please fill in the required fields (Name and Date of Birth)');
      return;
    }
    
    const newProfile = {
      id: isEditing ? selectedProfile.id : Math.max(...profiles.map(p => p.id), 0) + 1,
      ...formData,
      children: formData.children.split(',').map(child => child.trim()).filter(child => child),
      parents: formData.parents.split(',').map(parent => parent.trim()).filter(parent => parent)
    };

    if (isEditing && selectedProfile) {
      setProfiles(profiles.map(profile => 
        profile.id === selectedProfile.id ? newProfile : profile
      ));
      setSelectedProfile(newProfile);
    } else {
      setProfiles([...profiles, newProfile]);
    }
    
    resetForm();
    setCurrentView('list');
    setIsEditing(false);
    setShowAddMemberModal(false);
  };

  const handleEdit = (profile) => {
    setSelectedProfile(profile);
    setIsEditing(true);
    setFormData({
      ...profile,
      children: Array.isArray(profile.children) ? profile.children.join(', ') : '',
      parents: Array.isArray(profile.parents) ? profile.parents.join(', ') : ''
    });
    setCurrentView('form');
  };

  const handleDelete = (profileId) => {
    if (window.confirm('Are you sure you want to delete this profile?')) {
      setProfiles(profiles.filter(p => p.id !== profileId));
      if (selectedProfile && selectedProfile.id === profileId) {
        setSelectedProfile(null);
      }
    }
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          photo: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          setProfiles(importedData);
          alert('Data imported successfully!');
        } catch (error) {
          alert('Error importing data. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(profiles, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'family_tree_data.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const openAddMemberModal = (type) => {
    setAddMemberType(type);
    setShowAddMemberModal(true);
    resetForm();
    
    if (selectedProfile) {
      if (type === 'child') {
        setFormData(prev => ({
          ...prev,
          parents: selectedProfile.name + (selectedProfile.spouse ? `, ${selectedProfile.spouse}` : '')
        }));
      } else if (type === 'parent') {
        setFormData(prev => ({
          ...prev,
          children: selectedProfile.name
        }));
      } else if (type === 'spouse') {
        setFormData(prev => ({
          ...prev,
          spouse: selectedProfile.name,
          marriageDate: selectedProfile.marriageDate || ''
        }));
      } else if (type === 'sibling') {
        setFormData(prev => ({
          ...prev,
          parents: Array.isArray(selectedProfile.parents) ? selectedProfile.parents.join(', ') : ''
        }));
      }
    }
  };

  const buildFamilyTree = () => {
    const rootProfiles = profiles.filter(profile => 
      !profile.parents || profile.parents.length === 0
    );
    
    const buildTree = (profile) => {
      const children = profiles.filter(p => 
        p.parents && p.parents.includes(profile.name)
      );
      
      return {
        ...profile,
        treeChildren: children.map(child => buildTree(child))
      };
    };

    return rootProfiles.map(profile => buildTree(profile));
  };

  const toggleNode = (nodeId) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (profile.birthPlace && profile.birthPlace.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesGender = !filters.gender || profile.gender === filters.gender;
    const matchesAlive = filters.alive === '' || 
                        (filters.alive === 'alive' && !profile.deathDate) ||
                        (filters.alive === 'deceased' && profile.deathDate);

    return matchesSearch && matchesGender && matchesAlive;
  });

  const renderTreeSidebar = (tree, level = 0) => {
    return tree.map(node => (
      <div key={node.id} style={{ marginLeft: `${level * 16}px` }} className="mb-1">
        <div 
          className={`flex items-center p-3 hover:bg-slate-100 cursor-pointer rounded-lg transition-all duration-200 ${
            selectedProfile && selectedProfile.id === node.id 
              ? 'bg-emerald-50 border-l-4 border-emerald-500 shadow-sm' 
              : 'hover:shadow-sm'
          }`}
          onClick={() => setSelectedProfile(node)}
        >
          {node.treeChildren && node.treeChildren.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(node.id);
              }}
              className="mr-2 p-1 hover:bg-slate-200 rounded-md transition-colors"
            >
              {expandedNodes.has(node.id) ? 
                <ChevronDown size={14} className="text-slate-600" /> : 
                <ChevronRight size={14} className="text-slate-600" />
              }
            </button>
          )}
          <div className="flex-1 min-w-0">
            <div className={`font-medium text-sm truncate ${
              selectedProfile && selectedProfile.id === node.id ? 'text-emerald-700' : 'text-slate-800'
            }`}>
              {node.name}
            </div>
            <div className="text-xs text-slate-500 truncate">
              {new Date(node.dateOfBirth).getFullYear()} - {node.deathDate ? new Date(node.deathDate).getFullYear() : 'Present'}
            </div>
          </div>
        </div>
        
        {node.treeChildren && node.treeChildren.length > 0 && expandedNodes.has(node.id) && (
          <div className="ml-2">
            {renderTreeSidebar(node.treeChildren, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" style={{ width: '100vw', overflowX: 'hidden' }}>
      {/* Fully Responsive Header */}
      <div className="bg-white shadow-sm border-b border-slate-200 w-full sticky top-0 z-40">
        <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8">
          {/* Mobile Header (xs to md) */}
          <div className="flex md:hidden justify-between items-center py-4">
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg shadow-md flex-shrink-0">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent truncate">
                  Family Tree Manager
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 truncate">Preserve your family's legacy</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 flex-shrink-0">
              <button
                onClick={() => importInputRef.current?.click()}
                className="flex items-center px-2 py-2 bg-gradient-to-r from-purple-600 to-violet-700 text-white rounded-md hover:from-purple-700 hover:to-violet-800 transition-all duration-200 shadow-sm"
                title="Import Data"
              >
                <Upload className="w-4 h-4" />
                <span className="hidden xs:inline ml-1 text-xs">Import</span>
              </button>
              <button
                onClick={exportData}
                className="flex items-center px-2 py-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-md hover:from-orange-600 hover:to-amber-700 transition-all duration-200 shadow-sm"
                title="Export Data"
              >
                <Download className="w-4 h-4" />
                <span className="hidden xs:inline ml-1 text-xs">Export</span>
              </button>
            </div>
          </div>

          {/* Tablet Header (md to lg) */}
          <div className="hidden md:flex lg:hidden justify-between items-center py-5">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg flex-shrink-0">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent truncate">
                  Family Tree Manager
                </h1>
                <p className="text-sm text-slate-600 truncate">Preserve your family's legacy across generations</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 flex-shrink-0">
              <button
                onClick={() => importInputRef.current?.click()}
                className="flex items-center px-3 py-2 bg-gradient-to-r from-purple-600 to-violet-700 text-white rounded-lg hover:from-purple-700 hover:to-violet-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import
              </button>
              <button
                onClick={exportData}
                className="flex items-center px-3 py-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-lg hover:from-orange-600 hover:to-amber-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>

          {/* Desktop Header (lg and up) */}
          <div className="hidden lg:flex justify-between items-center py-6">
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg flex-shrink-0">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Family Tree Manager
                </h1>
                <p className="text-slate-600">Preserve your family's legacy across generations</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 flex-shrink-0">
              <button
                onClick={() => importInputRef.current?.click()}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-violet-700 text-white rounded-lg hover:from-purple-700 hover:to-violet-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import
              </button>
              <button
                onClick={exportData}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-lg hover:from-orange-600 hover:to-amber-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>

          {/* Hidden file input */}
          <input
            type="file"
            ref={importInputRef}
            onChange={importData}
            accept=".json"
            className="hidden"
          />
        </div>
      </div>

      <div className="px-2 sm:px-4 lg:px-6 py-8" style={{ width: '100%', maxWidth: 'none' }}>
        {/* Navigation */}
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 mb-8 border border-slate-200" style={{ width: '100%' }}>
          <div className="flex flex-wrap gap-2 sm:gap-4 justify-between items-center" style={{ width: '100%' }}>
            <div className="flex gap-2 sm:gap-3 flex-wrap">
              <button
                onClick={() => {
                  setCurrentView('list');
                  setSelectedProfile(null);
                }}
                className={`flex items-center px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 text-sm sm:text-base ${
                  currentView === 'list' 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25' 
                    : 'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 hover:from-slate-200 hover:to-slate-300 hover:text-slate-800'
                }`}
              >
                <Eye className="mr-1 sm:mr-2" size={16} />
                <span className="hidden xs:inline">View Profiles</span>
                <span className="xs:hidden">View</span>
              </button>
              <button
                onClick={() => {
                  setCurrentView('form');
                  setIsEditing(false);
                  resetForm();
                  setSelectedProfile(null);
                }}
                className={`flex items-center px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 text-sm sm:text-base ${
                  currentView === 'form' 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25' 
                    : 'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 hover:from-slate-200 hover:to-slate-300 hover:text-slate-800'
                }`}
              >
                <Plus className="mr-1 sm:mr-2" size={16} />
                <span className="hidden xs:inline">Add Profile</span>
                <span className="xs:hidden">Add</span>
              </button>
              <button
                onClick={() => {
                  setCurrentView('tree');
                  setSelectedProfile(null);
                }}
                className={`flex items-center px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 text-sm sm:text-base ${
                  currentView === 'tree' 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25' 
                    : 'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 hover:from-slate-200 hover:to-slate-300 hover:text-slate-800'
                }`}
              >
                <Users className="mr-1 sm:mr-2" size={16} />
                <span className="hidden sm:inline">Family Tree</span>
                <span className="sm:hidden">Tree</span>
              </button>
            </div>
            
            <div className="text-xs sm:text-sm text-slate-600 bg-gradient-to-r from-indigo-50 to-purple-50 px-2 sm:px-4 py-1 sm:py-2 rounded-lg border border-indigo-200 flex-shrink-0">
              <span className="font-medium text-indigo-700">{profiles.length}</span> 
              <span className="hidden xs:inline"> Family</span> Members
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        {(currentView === 'list' && !selectedProfile) && (
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 mb-8 border border-slate-200" style={{ width: '100%' }}>
            <div className="flex flex-col sm:flex-row gap-4" style={{ width: '100%' }}>
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-slate-50 focus:bg-white"
                  style={{ width: '100%' }}
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-4 sm:px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 flex-shrink-0 ${
                  showFilters 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25' 
                    : 'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 hover:from-slate-200 hover:to-slate-300 border border-slate-200'
                }`}
              >
                <Filter className="mr-2" size={18} />
                Filters
              </button>
            </div>

            {showFilters && (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 sm:p-6 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200" style={{ width: '100%' }}>
                <select
                  value={filters.gender}
                  onChange={(e) => setFilters({...filters, gender: e.target.value})}
                  className="px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white transition-all duration-200 w-full text-sm sm:text-base"
                >
                  <option value="">All Genders</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>

                <select
                  value={filters.alive}
                  onChange={(e) => setFilters({...filters, alive: e.target.value})}
                  className="px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white transition-all duration-200 w-full text-sm sm:text-base"
                >
                  <option value="">All Status</option>
                  <option value="alive">Living</option>
                  <option value="deceased">Deceased</option>
                </select>

                <div className="sm:col-span-2 lg:col-span-2">
                  <button
                    onClick={() => setFilters({gender: '', generation: '', ageRange: '', alive: ''})}
                    className="px-4 sm:px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-200 font-medium transform hover:scale-105 shadow-lg shadow-red-500/25 w-full text-sm sm:text-base"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Profile Detail View with Sidebar */}
        {selectedProfile && currentView === 'list' && (
          <div className="flex flex-col xl:flex-row gap-4 sm:gap-8" style={{ width: '100%' }}>
            {/* Tree Sidebar */}
            <div className="xl:w-80 w-full bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-slate-800">Family Tree</h3>
                <button
                  onClick={() => setSelectedProfile(null)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-500 hover:text-red-700 border border-red-200 hover:border-red-300"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {renderTreeSidebar(buildFamilyTree())}
              </div>
            </div>

            {/* Profile Details */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm p-4 sm:p-8 border border-slate-200" style={{ width: '100%' }}>
              <div className="flex flex-col lg:flex-row justify-between items-start mb-8 gap-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                  {selectedProfile.photo ? (
                    <img 
                      src={selectedProfile.photo} 
                      alt={selectedProfile.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-emerald-200 shadow-lg flex-shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-lg flex-shrink-0">
                      {selectedProfile.name.charAt(0)}
                    </div>
                  )}
                  <div className="text-center sm:text-left">
                    <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-2">{selectedProfile.name}</h2>
                    <p className="text-base sm:text-lg text-slate-600">
                      {calculateAge(selectedProfile.dateOfBirth, selectedProfile.deathDate)} years old
                      {selectedProfile.deathDate && (
                        <span className="ml-2 inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border border-red-200">
                          Deceased
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => handleEdit(selectedProfile)}
                  className="flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-lg shadow-blue-600/25 transform hover:scale-105 text-sm sm:text-base"
                >
                  <Edit2 className="mr-2" size={16} />
                  Edit Profile
                </button>
              </div>

              {/* Quick Add Buttons */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-8 p-4 sm:p-6 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl border border-emerald-100" style={{ width: '100%' }}>
                <button
                  onClick={() => openAddMemberModal('parent')}
                  className="flex items-center justify-center px-2 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all duration-200 font-medium shadow-lg shadow-blue-500/25 transform hover:scale-105 text-xs sm:text-sm"
                >
                  <UserPlus className="mr-1 sm:mr-2" size={14} />
                  <span className="hidden xs:inline">Add </span>Parent
                </button>
                <button
                  onClick={() => openAddMemberModal('spouse')}
                  className="flex items-center justify-center px-2 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-lg hover:from-rose-600 hover:to-pink-700 transition-all duration-200 font-medium shadow-lg shadow-rose-500/25 transform hover:scale-105 text-xs sm:text-sm"
                >
                  <Heart className="mr-1 sm:mr-2" size={14} />
                  <span className="hidden xs:inline">Add </span>Spouse
                </button>
                <button
                  onClick={() => openAddMemberModal('child')}
                  className="flex items-center justify-center px-2 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg hover:from-emerald-600 hover:to-green-700 transition-all duration-200 font-medium shadow-lg shadow-emerald-500/25 transform hover:scale-105 text-xs sm:text-sm"
                >
                  <Baby className="mr-1 sm:mr-2" size={14} />
                  <span className="hidden xs:inline">Add </span>Child
                </button>
                <button
                  onClick={() => openAddMemberModal('sibling')}
                  className="flex items-center justify-center px-2 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-lg hover:from-purple-600 hover:to-violet-700 transition-all duration-200 font-medium shadow-lg shadow-purple-500/25 transform hover:scale-105 text-xs sm:text-sm"
                >
                  <Users className="mr-1 sm:mr-2" size={14} />
                  <span className="hidden xs:inline">Add </span>Sibling
                </button>
              </div>

              {/* Profile Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8" style={{ width: '100%' }}>
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-3 sm:p-4 rounded-xl border border-slate-200">
                    <label className="flex items-center font-semibold text-slate-700 mb-2 text-sm sm:text-base">
                      <Calendar className="mr-2 text-emerald-600" size={16} />
                      Date of Birth
                    </label>
                    <p className="text-slate-900 font-medium text-sm sm:text-base">{selectedProfile.dateOfBirth}</p>
                  </div>
                  
                  {selectedProfile.gender && (
                    <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-3 sm:p-4 rounded-xl border border-slate-200">
                      <label className="flex items-center font-semibold text-slate-700 mb-2 text-sm sm:text-base">
                        <User className="mr-2 text-emerald-600" size={16} />
                        Gender
                      </label>
                      <p className="text-slate-900 font-medium text-sm sm:text-base">{selectedProfile.gender}</p>
                    </div>
                  )}
                  
                  {selectedProfile.birthPlace && (
                    <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-3 sm:p-4 rounded-xl border border-slate-200">
                      <label className="flex items-center font-semibold text-slate-700 mb-2 text-sm sm:text-base">
                        <MapPin className="mr-2 text-emerald-600" size={16} />
                        Birth Place
                      </label>
                      <p className="text-slate-900 font-medium text-sm sm:text-base">{selectedProfile.birthPlace}</p>
                    </div>
                  )}
                  
                  {selectedProfile.occupation && (
                    <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-3 sm:p-4 rounded-xl border border-slate-200">
                      <label className="font-semibold text-slate-700 mb-2 block text-sm sm:text-base">Occupation</label>
                      <p className="text-slate-900 font-medium text-sm sm:text-base">{selectedProfile.occupation}</p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4 sm:space-y-6">
                  {selectedProfile.spouse && (
                    <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-3 sm:p-4 rounded-xl border border-slate-200">
                      <label className="flex items-center font-semibold text-slate-700 mb-2 text-sm sm:text-base">
                        <Heart className="mr-2 text-rose-600" size={16} />
                        Spouse
                      </label>
                      <p className="text-slate-900 font-medium text-sm sm:text-base">{selectedProfile.spouse}</p>
                    </div>
                  )}
                  
                  {selectedProfile.marriageDate && (
                    <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-3 sm:p-4 rounded-xl border border-slate-200">
                      <label className="font-semibold text-slate-700 mb-2 block text-sm sm:text-base">Marriage Date</label>
                      <p className="text-slate-900 font-medium text-sm sm:text-base">{selectedProfile.marriageDate}</p>
                    </div>
                  )}
                  
                  {selectedProfile.children && selectedProfile.children.length > 0 && (
                    <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-3 sm:p-4 rounded-xl border border-slate-200">
                      <label className="flex items-center font-semibold text-slate-700 mb-3 text-sm sm:text-base">
                        <Baby className="mr-2 text-emerald-600" size={16} />
                        Children
                      </label>
                      <ul className="space-y-2">
                        {selectedProfile.children.map((child, index) => (
                          <li key={index} className="flex items-center text-slate-900 font-medium text-sm sm:text-base">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3 flex-shrink-0"></span>
                            {child}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {selectedProfile.parents && selectedProfile.parents.length > 0 && (
                    <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-3 sm:p-4 rounded-xl border border-slate-200">
                      <label className="font-semibold text-slate-700 mb-3 block text-sm sm:text-base">Parents</label>
                      <ul className="space-y-2">
                        {selectedProfile.parents.map((parent, index) => (
                          <li key={index} className="flex items-center text-slate-900 font-medium text-sm sm:text-base">
                            <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 flex-shrink-0"></span>
                            {parent}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {selectedProfile.deathDate && (
                    <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-3 sm:p-4 rounded-xl border border-slate-200">
                      <label className="font-semibold text-slate-700 mb-2 block text-sm sm:text-base">Date of Death</label>
                      <p className="text-slate-900 font-medium text-sm sm:text-base">{selectedProfile.deathDate}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {selectedProfile.biography && (
                <div className="mt-6 sm:mt-8 bg-gradient-to-r from-emerald-50 to-blue-50 p-4 sm:p-6 rounded-xl border border-emerald-200" style={{ width: '100%' }}>
                  <label className="flex items-center font-semibold text-slate-700 mb-4 text-base sm:text-lg">
                    <FileText className="mr-2 text-emerald-600" size={20} />
                    Biography
                  </label>
                  <p className="text-slate-900 leading-relaxed text-sm sm:text-lg">{selectedProfile.biography}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Rest of the components remain the same... */}
        {/* Form View */}
        {currentView === 'form' && (
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-8 border border-slate-200" style={{ width: '100%' }}>
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                {isEditing ? 'Edit Profile' : 'Add New Family Member'}
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                {isEditing ? 'Update the information below' : 'Fill in the details to add a new family member'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8" style={{ width: '100%' }}>
              {/* Photo Upload */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-4 sm:p-6 rounded-xl text-center border border-slate-200">
                  <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-4">Profile Photo</h3>
                  
                  {formData.photo ? (
                    <div className="relative inline-block">
                      <img 
                        src={formData.photo} 
                        alt="Profile preview"
                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover mx-auto border-4 border-emerald-200 shadow-lg"
                      />
                      <button
                        onClick={() => setFormData({...formData, photo: null})}
                        className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full flex items-center justify-center hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg transform hover:scale-110"
                      >
                        <X size={12} className="sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-slate-300 to-slate-400 rounded-full mx-auto flex items-center justify-center text-slate-600 mb-4 shadow-lg">
                      <Camera size={32} className="sm:w-10 sm:h-10" />
                    </div>
                  )}
                  
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-4 flex items-center justify-center w-full px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-xl hover:from-indigo-700 hover:to-purple-800 transition-all duration-200 shadow-lg shadow-indigo-600/25 transform hover:scale-105 text-sm sm:text-base"
                  >
                    <Camera className="mr-2" size={16} />
                    {formData.photo ? 'Change Photo' : 'Upload Photo'}
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>

              {/* Form Fields */}
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6" style={{ width: '100%' }}>
                <div className="md:col-span-2">
                  <label className="flex items-center text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                    <User className="mr-2 text-emerald-600" size={16} />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-slate-50 focus:bg-white text-sm sm:text-base"
                    style={{ width: '100%' }}
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                    <Calendar className="mr-2 text-emerald-600" size={16} />
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-slate-50 focus:bg-white text-sm sm:text-base"
                    style={{ width: '100%' }}
                    required
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-semibold text-slate-700 mb-2 block">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-slate-50 focus:bg-white text-sm sm:text-base"
                    style={{ width: '100%' }}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                    <MapPin className="mr-2 text-emerald-600" size={16} />
                    Birth Place
                  </label>
                  <input
                    type="text"
                    value={formData.birthPlace}
                    onChange={(e) => setFormData({...formData, birthPlace: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-slate-50 focus:bg-white text-sm sm:text-base"
                    placeholder="City, State, Country"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label className="flex items-center text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                    <Heart className="mr-2 text-rose-600" size={16} />
                    Marriage Date
                  </label>
                  <input
                    type="date"
                    value={formData.marriageDate}
                    onChange={(e) => setFormData({...formData, marriageDate: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-slate-50 focus:bg-white text-sm sm:text-base"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-semibold text-slate-700 mb-2 block">Spouse Name</label>
                  <input
                    type="text"
                    value={formData.spouse}
                    onChange={(e) => setFormData({...formData, spouse: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-slate-50 focus:bg-white text-sm sm:text-base"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label className="flex items-center text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                    <Baby className="mr-2 text-emerald-600" size={16} />
                    Children Names
                  </label>
                  <input
                    type="text"
                    value={formData.children}
                    onChange={(e) => setFormData({...formData, children: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-slate-50 focus:bg-white text-sm sm:text-base"
                    placeholder="Separate multiple names with commas"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-semibold text-slate-700 mb-2 block">Parents Names</label>
                  <input
                    type="text"
                    value={formData.parents}
                    onChange={(e) => setFormData({...formData, parents: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-slate-50 focus:bg-white text-sm sm:text-base"
                    placeholder="Separate multiple names with commas"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-semibold text-slate-700 mb-2 block">Occupation</label>
                  <input
                    type="text"
                    value={formData.occupation}
                    onChange={(e) => setFormData({...formData, occupation: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-slate-50 focus:bg-white text-sm sm:text-base"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-semibold text-slate-700 mb-2 block">Date of Death</label>
                  <input
                    type="date"
                    value={formData.deathDate}
                    onChange={(e) => setFormData({...formData, deathDate: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-slate-50 focus:bg-white text-sm sm:text-base"
                    style={{ width: '100%' }}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                    <FileText className="mr-2 text-emerald-600" size={16} />
                    Biography
                  </label>
                  <textarea
                    value={formData.biography}
                    onChange={(e) => setFormData({...formData, biography: e.target.value})}
                    rows={4}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 resize-none bg-slate-50 focus:bg-white text-sm sm:text-base"
                    placeholder="Tell their story, achievements, and memories..."
                    style={{ width: '100%' }}
                  />
                </div>

                <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
                  <button
                    onClick={handleSubmit}
                    className="flex items-center justify-center px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl hover:from-green-700 hover:to-emerald-800 font-semibold transition-all duration-200 shadow-lg shadow-green-600/25 transform hover:scale-105 text-sm sm:text-base"
                  >
                    <Save className="mr-2" size={16} />
                    {isEditing ? 'Update Profile' : 'Create Profile'}
                  </button>
                  <button
                    onClick={() => {
                      resetForm();
                      setCurrentView('list');
                      setIsEditing(false);
                      setSelectedProfile(null);
                    }}
                    className="px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-gray-500 to-slate-600 text-white rounded-xl hover:from-gray-600 hover:to-slate-700 font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg shadow-gray-500/25 text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* List View */}
        {currentView === 'list' && !selectedProfile && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4 sm:gap-6" style={{ width: '100%' }}>
            {filteredProfiles.map(profile => (
              <div key={profile.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-slate-200 w-full">
                <div className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-4 sm:mb-6">
                    <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                      {profile.photo ? (
                        <img 
                          src={profile.photo} 
                          alt={profile.name}
                          className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-emerald-200 shadow-md flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white text-lg sm:text-xl font-bold shadow-md flex-shrink-0">
                          {profile.name.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1 truncate">{profile.name}</h3>
                        <p className="text-sm sm:text-base text-slate-600 font-medium truncate">{profile.occupation}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-1 sm:gap-2 flex-shrink-0 ml-2">
                      <button
                        onClick={() => handleEdit(profile)}
                        className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 border border-blue-200 hover:border-blue-300 transform hover:scale-110 shadow-sm hover:shadow-md"
                      >
                        <Edit2 size={14} className="sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(profile.id)}
                        className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 border border-red-200 hover:border-red-300 transform hover:scale-110 shadow-sm hover:shadow-md"
                      >
                        <Trash2 size={14} className="sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                    <div className="flex items-center text-slate-600">
                      <Calendar className="mr-2 sm:mr-3 text-emerald-600 flex-shrink-0" size={14} />
                      <span className="font-medium truncate">
                        {profile.dateOfBirth} {profile.deathDate ? `- ${profile.deathDate}` : '- Present'}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-slate-600">
                      <User className="mr-2 sm:mr-3 text-emerald-600 flex-shrink-0" size={14} />
                      <span className="font-medium">Age: {calculateAge(profile.dateOfBirth, profile.deathDate)} years</span>
                    </div>
                    
                    {profile.birthPlace && (
                      <div className="flex items-center text-slate-600">
                        <MapPin className="mr-2 sm:mr-3 text-emerald-600 flex-shrink-0" size={14} />
                        <span className="font-medium truncate">{profile.birthPlace}</span>
                      </div>
                    )}
                    
                    {profile.spouse && (
                      <div className="flex items-center text-slate-600">
                        <Heart className="mr-2 sm:mr-3 text-rose-600 flex-shrink-0" size={14} />
                        <span className="font-medium truncate">Married to {profile.spouse}</span>
                      </div>
                    )}
                    
                    {profile.children && profile.children.length > 0 && (
                      <div className="flex items-center text-slate-600">
                        <Baby className="mr-2 sm:mr-3 text-emerald-600 flex-shrink-0" size={14} />
                        <span className="font-medium">{profile.children.length} children</span>
                      </div>
                    )}
                  </div>
                  
                  {profile.biography && (
                    <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-slate-700 line-clamp-3 leading-relaxed">
                      {profile.biography}
                    </p>
                  )}
                  
                  <button
                    onClick={() => setSelectedProfile(profile)}
                    className="mt-4 sm:mt-6 w-full px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 font-semibold transition-all duration-200 shadow-lg shadow-emerald-500/25 transform hover:scale-105 text-xs sm:text-sm"
                  >
                    View Full Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tree View */}
        {currentView === 'tree' && (
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-8 border border-slate-200" style={{ width: '100%' }}>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 sm:mb-8">Family Tree Structure</h2>
            {profiles.length === 0 ? (
              <div className="text-center py-16">
                <Users className="mx-auto h-16 w-16 sm:h-24 sm:w-24 text-slate-400 mb-6" />
                <h3 className="text-xl sm:text-2xl font-semibold text-slate-700 mb-3">No Family Members Yet</h3>
                <p className="text-slate-500 mb-8 text-base sm:text-lg">Start building your family tree by adding some profiles!</p>
                <button
                  onClick={() => setCurrentView('form')}
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 font-semibold shadow-lg shadow-emerald-600/25 transform hover:scale-105 text-sm sm:text-base"
                >
                  Add First Member
                </button>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4" style={{ width: '100%' }}>
                {buildFamilyTree().map(profile => (
                  <TreeNode key={profile.id} profile={profile} level={0} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add Member Modal */}
        {showAddMemberModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6 border-b border-slate-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Add {addMemberType.charAt(0).toUpperCase() + addMemberType.slice(1)}
                  </h2>
                  <button
                    onClick={() => setShowAddMemberModal(false)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-all duration-200 text-red-500 hover:text-red-700 border border-red-200 hover:border-red-300 transform hover:scale-110"
                  >
                    <X size={20} className="sm:w-6 sm:h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full">
                  <div>
                    <label className="flex items-center text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                      <User className="mr-2 text-emerald-600" size={16} />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-slate-50 focus:bg-white text-sm sm:text-base"
                      style={{ width: '100%' }}
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                      <Calendar className="mr-2 text-emerald-600" size={16} />
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-slate-50 focus:bg-white text-sm sm:text-base"
                      style={{ width: '100%' }}
                      required
                    />
                  </div>

                  <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                    <button
                      onClick={handleSubmit}
                      className="flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl hover:from-green-700 hover:to-emerald-800 font-semibold transition-all duration-200 shadow-lg shadow-green-600/25 transform hover:scale-105 text-sm sm:text-base"
                    >
                      <Save className="mr-2" size={16} />
                      Create Profile
                    </button>
                    <button
                      onClick={() => setShowAddMemberModal(false)}
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-gray-500 to-slate-600 text-white rounded-xl hover:from-gray-600 hover:to-slate-700 font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg shadow-gray-500/25 text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// TreeNode component for recursive tree rendering
const TreeNode = ({ profile, level }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const hasChildren = profile.children && profile.children.length > 0;
  
  return (
    <div className="mb-3 w-full">
      <div 
        className={`flex items-center p-3 sm:p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200 hover:shadow-md transition-all cursor-pointer hover:from-emerald-50 hover:to-teal-50 w-full`}
        style={{ marginLeft: `${level * 16}px`, width: `calc(100% - ${level * 16}px)` }}
      >
        {hasChildren && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mr-2 sm:mr-3 p-1.5 sm:p-2 hover:bg-emerald-100 rounded-lg transition-all duration-200 transform hover:scale-110 flex-shrink-0"
          >
            {isExpanded ? <ChevronDown size={14} className="sm:w-4 sm:h-4 text-emerald-600" /> : <ChevronRight size={14} className="sm:w-4 sm:h-4 text-emerald-600" />}
          </button>
        )}
        
        <div className="flex-1 flex items-center space-x-3 sm:space-x-4 min-w-0">
          {profile.photo ? (
            <img 
              src={profile.photo} 
              alt={profile.name}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-emerald-200 shadow-md flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md flex-shrink-0">
              {profile.name.charAt(0)}
            </div>
          )}
          
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-sm sm:text-base text-slate-900 truncate">{profile.name}</div>
            <div className="text-xs sm:text-sm text-slate-600 truncate">
              {profile.dateOfBirth} - {profile.deathDate || 'Present'}
              {profile.birthPlace && ` • ${profile.birthPlace}`}
            </div>
          </div>
        </div>
      </div>
      
      {hasChildren && isExpanded && (
        <div className="ml-4 sm:ml-6 mt-3 space-y-3">
          {/* Render children recursively */}
        </div>
      )}
    </div>
  );
};

export default FamilyTreeApp;
