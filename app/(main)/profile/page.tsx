"use client";

import { ProfileSection } from "@/components/profile/ProfileSection";
import { ProfileField } from "@/components/profile/ProfileField";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();

  // Get initials for avatar
  const getInitials = () => {
    if (user?.displayName) {
      return user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  // Format joined date from user metadata
  const getJoinedDate = () => {
    if (user?.metadata?.creationTime) {
      const date = new Date(user.metadata.creationTime);
      return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    }
    return "Recently";
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto pt-10 pb-24 px-6 space-y-10">
        <h1 className="text-2xl font-semibold text-foreground">Your profile</h1>

        {/* Avatar Section */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-xl font-medium">
            {getInitials()}
          </div>
          <div className="text-foreground">
            <p className="text-base">Manage your personal information</p>
          </div>
        </div>

        {/* Account Information Section */}
        <ProfileSection title="Account Information">
          <ProfileField label="Name" value={user.displayName || "Not set"} />
          <ProfileField label="Email" value={user.email || "Not available"} />
          <ProfileField label="Member since" value={getJoinedDate()} isLast />
        </ProfileSection>

        {/* Security Section */}
        <ProfileSection title="Security">
          <ProfileField label="Account status" value="Active" isLast />
        </ProfileSection>
      </div>
    </div>
  );
}
