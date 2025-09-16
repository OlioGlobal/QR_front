"use client";
import React, { useState, useEffect } from "react";
import {
  Eye,
  Edit,
  Trash2,
  User,
  Building2,
  Mail,
  Activity,
  Phone,
  MapPin,
  Calendar,
} from "lucide-react";

// Create/Update User Modal Component
const CreateOrUpdateUserModal = ({
  mode = "create",
  userId = null,
  initialData = null,
  onSuccess,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    company: "",
    tagline: "",
    phone: "",
    email: "",
    address: "",
    linkedin: "",
    instagram: "",
    youtube: "",
    whatsapp: "",
    directions: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [companyLogo, setCompanyLogo] = useState(null);

  // Pre-fill data for update
  useEffect(() => {
    if (mode === "update" && initialData) {
      setFormData({
        name: initialData.name || "",
        designation: initialData.designation || "",
        company: initialData.company || "",
        tagline: initialData.tagline || "",
        phone: initialData.phone || "",
        email: initialData.email || "",
        address: initialData.address || "",
        linkedin: initialData.linkedin || "",
        instagram: initialData.instagram || "",
        youtube: initialData.youtube || "",
        whatsapp: initialData.whatsapp || "",
        directions: initialData.directions || "",
      });
    }
  }, [initialData, mode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = new FormData();
    payload.append("userData", JSON.stringify(formData));
    if (profileImage) payload.append("profileImage", profileImage);
    if (companyLogo) payload.append("companyLogo", companyLogo);

    const endpoint =
      mode === "create"
        ? `${process.env.NEXT_PUBLIC_BackendURL}users/create`
        : `${process.env.NEXT_PUBLIC_BackendURL}users/update/${userId}`;

    try {
      const response = await fetch(endpoint, {
        method: mode === "create" ? "POST" : "PUT",
        body: payload,
      });

      const result = await response.json();
      console.log(result);

      if (response.ok) {
        alert(
          mode === "create"
            ? "User created successfully!"
            : "User updated successfully!"
        );
        setShowModal(false);
        onSuccess(); // Refresh the table

        // Reset form for create mode
        if (mode === "create") {
          setFormData({
            name: "",
            designation: "",
            company: "",
            tagline: "",
            phone: "",
            email: "",
            address: "",
            linkedin: "",
            instagram: "",
            directions: "",
            youtube: "",
            whatsapp: "",
          });
          setProfileImage(null);
          setCompanyLogo(null);
        }
      } else {
        throw new Error(result.message || "Request failed");
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className={`${
          mode === "create"
            ? "bg-blue-600 hover:bg-blue-700 px-6 py-2"
            : "bg-yellow-500 hover:bg-yellow-600 p-2"
        } text-white rounded-md transition-colors flex items-center gap-2`}
        onClick={() => setShowModal(true)}
      >
        {mode === "create" ? (
          <>
            <User size={16} />
            Create User
          </>
        ) : (
          <Edit size={16} />
        )}
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              {mode === "create" ? "Create New User" : "Update User"}
            </h2>

            <div onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { field: "name", label: "Full Name", type: "text" },
                  { field: "designation", label: "Designation", type: "text" },
                  { field: "company", label: "Company", type: "text" },
                  { field: "tagline", label: "Tagline", type: "text" },
                  { field: "phone", label: "Phone", type: "tel" },
                  { field: "email", label: "Email", type: "email" },
                  { field: "whatsapp", label: "WhatsApp Number", type: "tel" },
                  { field: "linkedin", label: "LinkedIn URL", type: "url" },
                  { field: "instagram", label: "Instagram URL", type: "url" },
                  { field: "youtube", label: "YouTube URL", type: "url" },
                  { field: "directions", label: "GoogleMap URL", type: "url" }, // Fixed typo here (filed -> field)
                ].map(({ field, label, type }) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {label}
                    </label>
                    <input
                      type={type}
                      name={field}
                      placeholder={label}
                      value={formData[field]}
                      onChange={handleChange}
                      required={
                        !["linkedin", "instagram", "directions"].includes(field)
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  name="address"
                  placeholder="Full Address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProfileImage(e.target.files[0])}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Logo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCompanyLogo(e.target.files[0])}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  {loading && (
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  )}
                  {mode === "create" ? "Create User" : "Update User"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// QR Code Modal Component
const QRCodeModal = ({ user, isOpen, onClose }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-[90%] shadow-xl">
        <h3 className="text-xl font-semibold mb-4 text-center">
          QR Code - {user.name}
        </h3>
        <div className="text-center">
          <img
            src={user.qrCode?.url}
            alt={`QR Code for ${user.name}`}
            className="mx-auto mb-4 max-w-full h-auto border rounded-lg"
          />
          <p className="text-sm text-gray-600 mb-4">
            Scan this QR code to view contact details
          </p>
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Main User Management Component
const UserManagementTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedQRUser, setSelectedQRUser] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);

  // Mock data for demonstration - replace with actual API call
  const mockUsers = [
    {
      _id: "684b00b16a00cc30f3dc01aa",
      name: "Yash",
      designation: "Data Management Analyst",
      company: "testing",
      tagline: "testing is key",
      phone: "9096842842",
      email: "choudhariyash@gmail.com",
      address: "Hamal Mapde",
      profileImage: {
        url: "https://res.cloudinary.com/dsxfg3jdt/image/upload/v1749745857/visiting-cards/profiles/profile_684b00b16a00cc30f3dc01aa.jpg",
      },
      companyLogo: {
        url: "https://res.cloudinary.com/dsxfg3jdt/image/upload/v1749745859/visiting-cards/logos/logo_684b00b16a00cc30f3dc01aa.png",
      },
      qrCode: {
        url: "https://res.cloudinary.com/dsxfg3jdt/image/upload/v1749745860/visiting-cards/qr-codes/qr_684b00b16a00cc30f3dc01aa.png",
      },
      createdAt: "2025-06-12T16:30:41.406Z",
    },
    {
      _id: "684affba6a00cc30f3dc01a5",
      name: "test user",
      designation: "tester",
      company: "testing",
      tagline: "testing is key",
      phone: "7894561230",
      email: "test@gmail.com",
      address: "Hamal Mapde",
      profileImage: {
        url: "https://res.cloudinary.com/dsxfg3jdt/image/upload/v1749745605/visiting-cards/profiles/profile_684affba6a00cc30f3dc01a5.jpg",
      },
      companyLogo: {
        url: "https://res.cloudinary.com/dsxfg3jdt/image/upload/v1749745607/visiting-cards/logos/logo_684affba6a00cc30f3dc01a5.png",
      },
      qrCode: {
        url: "https://res.cloudinary.com/dsxfg3jdt/image/upload/v1749745608/visiting-cards/qr-codes/qr_684affba6a00cc30f3dc01a5.png",
      },
      createdAt: "2025-06-12T16:26:34.845Z",
    },
    {
      _id: "684aefe36a00cc30f3dc019e",
      name: "John Does",
      designation: "Software Engineer",
      company: "Tech Corp",
      tagline: "Innovating the future",
      phone: "9876543210",
      email: "john.doe@example.com",
      address: "123 Main Street",
      linkedin: "https://linkedin.com/in/johndoe",
      instagram: "https://instagram.com/johndoe",
      profileImage: {
        url: "https://res.cloudinary.com/dsxfg3jdt/image/upload/v1749744064/visiting-cards/profiles/profile_684aefe36a00cc30f3dc019e.png",
      },
      companyLogo: {
        url: "https://res.cloudinary.com/dsxfg3jdt/image/upload/v1749744067/visiting-cards/logos/logo_684aefe36a00cc30f3dc019e.png",
      },
      qrCode: {
        url: "https://res.cloudinary.com/dsxfg3jdt/image/upload/v1749741552/visiting-cards/qr-codes/qr_684aefe36a00cc30f3dc019e.png",
      },
      createdAt: "2025-06-12T15:18:59.920Z",
    },
  ];

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      // Replace this with your actual API cal

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BackendURL}users/all?page=${page}&limit=10`
      );

      if (response.ok) {
        const result = await response.json();
        const { data, totalUsers, totalPages } = result;

        setUsers(data);
        setTotalUsers(totalUsers);
        setTotalPages(totalPages);
        setCurrentPage(page);
      } else {
        // Fallback to mock data for demonstration
        setUsers(mockUsers);
        setTotalUsers(mockUsers.length);
        setTotalPages(1);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      // Fallback to mock data for demonstration
      setUsers(mockUsers);
      setTotalUsers(mockUsers.length);
      setTotalPages(1);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete ${userName}?`)) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BackendURL}users/delete/${userId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        alert("User deleted successfully!");
        fetchUsers(currentPage); // Refresh current page
      } else {
        throw new Error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  const handleViewQR = (user) => {
    setSelectedQRUser(user);
    setShowQRModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                User Management
              </h1>
              <p className="text-gray-600 mt-1">
                Total {totalUsers} users • Page {currentPage} of {totalPages}
              </p>
            </div>
            <CreateOrUpdateUserModal
              mode="create"
              onSuccess={() => fetchUsers(1)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-700">
                  Profile
                </th>
                <th className="text-left p-4 font-semibold text-gray-700">
                  Contact Info
                </th>
                <th className="text-left p-4 font-semibold text-gray-700">
                  Company
                </th>
                <th className="text-left p-4 font-semibold text-gray-700">
                  Visit Count
                </th>
                <th className="text-left p-4 font-semibold text-gray-700">
                  QR Code
                </th>
                <th className="text-center p-4 font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.profileImage?.url}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                      />
                      <div>
                        <div className="font-semibold text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {user.designation}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail size={14} className="text-gray-400" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone size={14} className="text-gray-400" />
                        <span>{user.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin size={14} className="text-gray-400" />
                        <span className="truncate max-w-xs">
                          {user.address}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.companyLogo?.url}
                        alt={user.company}
                        className="w-10 h-10 rounded object-cover border border-gray-200"
                      />
                      <div>
                        <div className="font-medium text-gray-900">
                          {user.company}
                        </div>
                        <div className="text-sm text-gray-600 italic">
                          {user.tagline?.length > 20
                            ? user.tagline.slice(0, 20) + "..."
                            : user.tagline}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Activity size={14} className="text-gray-400" />
                      <span>{user.visitCount}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleViewQR(user)}
                      className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-2 rounded-md text-sm flex items-center gap-2 transition-colors"
                    >
                      <Eye size={14} />
                      View QR
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <CreateOrUpdateUserModal
                        mode="update"
                        userId={user._id}
                        initialData={user}
                        onSuccess={() => fetchUsers(currentPage)}
                      />
                      <button
                        onClick={() => handleDelete(user._id, user.name)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-6 border-t border-gray-200">
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => fetchUsers(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => fetchUsers(page)}
                      className={`px-3 py-2 rounded-md ${
                        page === currentPage
                          ? "bg-blue-600 text-white"
                          : "border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={() => fetchUsers(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      <QRCodeModal
        user={selectedQRUser}
        isOpen={showQRModal}
        onClose={() => {
          setShowQRModal(false);
          setSelectedQRUser(null);
        }}
      />
    </div>
  );
};

export default UserManagementTable;
