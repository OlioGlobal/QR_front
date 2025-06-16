"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Linkedin,
  Instagram,
  Download,
  Building2,
  ChevronRight,
  MessageCircle,
  Send,
  Link2,
  AddressBook,
  UserPlus,
  CircleUserRound,
} from "lucide-react";

export default function VisitingCardPage() {
  const params = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = params?.id;

  useEffect(() => {
    if (userId) {
      fetchUserData(userId);
      incrementVisitCount(userId); // Call the visit counter when component mounts
    }
  }, [userId]);

  const fetchUserData = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BackendURL}users/get/${id}`
      );
      const result = await response.json();

      if (result.success) {
        setUserData(result.data);
      } else {
        setError("Failed to fetch user data");
      }
    } catch (err) {
      setError("Error loading user data");
      console.error("Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  };

  const incrementVisitCount = async (id) => {
    try {
      // We don't need to await this or handle the response
      // as it's just for tracking purposes
      fetch(`${process.env.NEXT_PUBLIC_BackendURL}users/${id}/visit`, {
        method: "POST",
      }).catch((err) => {
        console.error("Error incrementing visit count:", err);
      });
    } catch (err) {
      console.error("Error in visit counter:", err);
    }
  };

  const generateVCF = () => {
    if (!userData) return;

    const vcfContent = `BEGIN:VCARD
  VERSION:3.0
  FN:${userData.name}
  ORG:${userData.company}
  TITLE:${userData.designation}
  TEL:${userData.phone}
  EMAIL:${userData.email}
  ADR:;;${userData.address};;;;
  URL:${userData.linkedin}
  NOTE:${userData.tagline}
  END:VCARD`;

    const blob = new Blob([vcfContent], { type: "text/vcard" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    // Replace spaces with underscores in both name and company
    const safeName = userData.name.replace(/\s+/g, "_");
    const safeCompany = userData.company?.replace(/\s+/g, "_") || "Company";

    link.href = url;
    link.download = `${safeName}_${safeCompany}.vcf`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-700 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">👤</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            No Data Found
          </h2>
          <p className="text-gray-600">User profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-6 relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 opacity-95"></div>

          <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-20 rounded-full -mr-16 -mt-16 shadow-xl backdrop-blur-sm"></div>

          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-20 rounded-full -ml-12 -mb-12 shadow-lg backdrop-blur-sm"></div>

          <div className="relative z-10 p-8 text-center">
            {/* Company Logo */}
            {userData.companyLogo && (
              <div className="flex justify-start mb-6">
                <div className="w-16 h-16 bg-white rounded-full p-2 shadow-md flex items-center justify-center">
                  <Image
                    src={userData.companyLogo?.url}
                    alt={`${userData.company} logo`}
                    width={32}
                    height={32}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}

            {userData.profileImage?.url ? (
              <div className="w-52 h-52 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
                <Image
                  src={userData.profileImage.url}
                  alt={userData.name}
                  width={120}
                  height={120}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            ) : null}

            {/* Name and Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {userData.name}
            </h1>
            <p className="text-gray-700 font-medium mb-1">
              {userData.designation}
            </p>
            <p className="text-gray-800 font-semibold">{userData.company}</p>

            {/* Contact Icons */}
            <div className="flex justify-center gap-4 mt-6">
              <a
                href={`tel:${userData.phone}`}
                className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-md"
              >
                <Phone className="w-5 h-5" />
              </a>
              <a
                href={`mailto:${userData.email}`}
                className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-md"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                href={`sms:${userData.phone}`}
                className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-md"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href={`https://wa.me/${userData.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-md"
              >
                <Image
                  src="/whatsapp.png" // Replace this with your actual image path
                  alt="WhatsApp"
                  width={34}
                  height={34}
                  className="object-contain"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Tagline Card */}
        {userData.tagline && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-800 text-center mb-2">
              {userData.tagline}
            </h2>
          </div>
        )}

        {/* Contact Us Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-md">
              <CircleUserRound className="w-10 h-10 text-gray-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Contact Information
            </h2>
          </div>

          {/* Info Sections */}
          <div className="space-y-5 text-sm text-gray-700">
            {/* Phone */}
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <Phone className="w-4 h-4 text-gray-500" />
              </div>
              <div>
                <h3 className="font-medium">Call Us</h3>
                <a
                  href={`tel:${userData.phone}`}
                  className="text-gray-600 hover:text-blue-600 transition-colors block"
                >
                  {userData.phone}
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <Mail className="w-4 h-4 text-gray-500" />
              </div>
              <div>
                <h3 className="font-medium">Email</h3>
                <a
                  href={`mailto:${userData.email}`}
                  className="text-gray-600 hover:text-blue-600 transition-colors block"
                >
                  {userData.email}
                </a>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <MapPin className="w-4 h-4 text-gray-500" />
              </div>
              <div>
                <h3 className="font-medium">Address</h3>
                <p className="text-gray-600 leading-relaxed">
                  {userData.address}
                </p>
              </div>
            </div>
            <div className="flex">
              {userData.directions ? (
                <Link
                  href={userData.directions}
                  className="mt-3 flex justify-center gap-2 items-center bg-gray-800 hover:bg-gray-900 text-white px-4 py-3 rounded-full text-sm font-medium transition-all"
                >
                  <Send className="w-6 h-6 text-gray-500" />
                  Get Directions
                </Link>
              ) : null}
            </div>
          </div>
        </div>

        {/* Social Media Card */}
        {(userData.linkedin || userData.instagram) && (
          <div className="bg-white p-6 mb-6 rounded-2xl shadow-lg">
            <div className="flex mb-5 justify-start gap-3 items-center">
              <div className="w-8 h-8 rounded-full flex items-center justify-center">
                <Link2 className="w-10 h-10 text-gray-500" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                Follow Me On
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {/* LinkedIn */}
              {userData.linkedin?.trim() && (
                <Link
                  href={userData.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group shadow-sm"
                >
                  <div className="w-11 h-11 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Linkedin className="w-8 h-8 text-white" />
                  </div>
                </Link>
              )}

              {/* Instagram */}
              {userData.instagram?.trim() && (
                <Link
                  href={userData.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group shadow-sm"
                >
                  <div className="w-11 h-11 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Instagram className="w-8 h-8 text-white" />
                  </div>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Floating Contact Button */}
      <button
        onClick={generateVCF}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 z-50"
        aria-label="Download Contact Card"
      >
        <UserPlus className="w-6 h-6" />
      </button>
    </div>
  );
}
