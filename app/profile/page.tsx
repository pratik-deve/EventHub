"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { ModeToggle } from "@/components/mode-toggle"
import { User, Mail, Lock, Camera, Save, Crown, Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"
import axios from "axios"
import { updateUserProfile, updateUserProfilePic } from "@/api/userApi"
import { set } from "date-fns"
import api from "@/api/axiosInstance"

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Form states

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fullname, setFullname] = useState(user?.fullname || "")
  const [username, setUsername] = useState(user?.username || "") // Initially set to the same as full name
  const [email, setEmail] = useState(user?.email || "")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSelectingFile, setIsSelectingFile] = useState(false)


  const {setUserProfilePic} = useAuth()

  const handleUpload = async() => {

     if(!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      })
      return }

    const formData = new FormData()
    formData.append("file", selectedFile)

    try {

      const data = await updateUserProfilePic(formData); 
        if(!data.imgUrl){
          toast({
            title: "Upload failed",
            description: "Please try again  .",
            variant: "destructive",
          })
          return;
        }

        await setUserProfilePic(data.imgUrl); // Assuming this function updates the user context

        toast({
          title: "Upload successful",
          description: "Your profile picture has been updated.",
        });
        setIsSelectingFile(false); 
        setSelectedFile(null); // Reset file selection
        
      } catch (err) {
        toast({
          title: "Upload failed",
          description: "Please try again later.",
          variant: "destructive",
        })
    }
      
      
  }



  const handleSaveProfile = async () => {
  if (!user || !user.id) {
    toast({
      title: "User not found",
      description: "Please sign in again.",
      variant: "destructive",
    });
    return;
  }

  setIsSaving(true);
  try {
    // Send the current user ID and updated profile data to the backend
    await updateUserProfile(user.id, { fullname, username, email });

     updateUser({ fullname, username, email }); // Update context

    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });

    setIsEditing(false);
  } catch (error) {
    console.error("Error updating profile:", error);
    toast({
      title: "Update failed",
      description: "Please try again later.",
      variant: "destructive",
    });
  } finally {
    setIsSaving(false);
  }
};
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      })
      return
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Password changed",
        description: "Your password has been updated successfully.",
      })
      setIsChangingPassword(false)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      toast({
        title: "Password change failed",
        description: "Please check your current password and try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const getSubscriptionStatus = () => {
    if (!user?.isOrganizer) return null

    switch (user.subscriptionStatus) {
      case "trial":
        return { label: "Free Trial", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" }
      case "monthly":
        return { label: "Pro Monthly", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300" }
      case "yearly":
        return { label: "Pro Yearly", color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300" }
      default:
        return null
    }
  }

  const subscriptionStatus = getSubscriptionStatus()

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-2">Profile Settings</h1>
            <p className="text-muted-foreground text-lg">Manage your account settings and preferences</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Picture & Basic Info */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Picture</CardTitle>
                  <CardDescription>Update your profile photo</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                      <AvatarFallback className="text-2xl">{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>

                    {!isSelectingFile ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsSelectingFile(true)} // Show file input on click
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Change Photo
                      </Button>
                    ) : (
                      <div className="space-y-4">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        />
                        <div className="flex gap-2">
                          <Button onClick={handleUpload}>
                            <Save className="w-4 h-4 mr-2" />
                            Upload
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsSelectingFile(false)
                              setSelectedFile(null) // Reset file selection
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Member Since</Label>
                    <p className="text-sm text-muted-foreground">
                      {new Date().toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Account Status</Label>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-sm text-muted-foreground">Active</span>
                    </div>
                  </div>

                  {user?.isOrganizer && subscriptionStatus && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Organizer Status</Label>
                        <Badge className={subscriptionStatus.color}>
                          <Crown className="w-3 h-3 mr-1" />
                          {subscriptionStatus.label}
                        </Badge>
                        {user.subscriptionExpiry && (
                          <p className="text-xs text-muted-foreground">
                            {user.subscriptionStatus === "trial" ? "Trial expires" : "Renews"}:{" "}
                            {new Date(user.subscriptionExpiry).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {!user?.isOrganizer && (
                <Card className="mt-6 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="w-5 h-5 text-primary" />
                      Become an Organizer
                    </CardTitle>
                    <CardDescription>Create and manage your own events with EventHub Pro</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full bg-gradient-to-r from-primary to-secondary">
                      <Link href="/subscription">
                        Get Started
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Main Settings */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Update your personal details</CardDescription>
                    </div>
                    {!isEditing && (
                      <Button variant="outline" onClick={() => setIsEditing(true)}>
                        Edit
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Full Name Field */}
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          value={fullname}
                          onChange={(e) => setFullname(e.target.value)}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {/* Username Field */}
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {/* Email Address Field */}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleSaveProfile} disabled={isSaving}>
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false)
                          setFullname(user?.name || "")
                          setEmail(user?.email || "")
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {user?.isOrganizer && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="w-5 h-5 text-primary" />
                      Subscription Management
                    </CardTitle>
                    <CardDescription>Manage your EventHub Pro subscription</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">Current Plan</p>
                        <p className="text-sm text-muted-foreground">
                          {subscriptionStatus?.label}
                          {user.subscriptionExpiry && (
                            <span>
                              {" "}
                              • {user.subscriptionStatus === "trial" ? "Expires" : "Renews"}{" "}
                              {new Date(user.subscriptionExpiry).toLocaleDateString()}
                            </span>
                          )}
                        </p>
                      </div>
                      {subscriptionStatus && (
                        <Badge className={subscriptionStatus.color}>{subscriptionStatus.label}</Badge>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" asChild>
                        <Link href="/subscription">
                          <Calendar className="w-4 h-4 mr-2" />
                          {user.subscriptionStatus === "trial" ? "Upgrade Plan" : "Change Plan"}
                        </Link>
                      </Button>
                      {user.isOrganizer && (
                        <Button variant="outline" asChild>
                          <Link href="/organizer/dashboard">
                            Organizer Dashboard
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Password Settings */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Password & Security</CardTitle>
                      <CardDescription>Update your password</CardDescription>
                    </div>
                    {!isChangingPassword && (
                      <Button variant="outline" onClick={() => setIsChangingPassword(true)}>
                        Change Password
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {isChangingPassword ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="currentPassword"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="pl-10"
                            placeholder="Enter current password"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="newPassword"
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="pl-10"
                              placeholder="Enter new password"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="confirmPassword"
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="pl-10"
                              placeholder="Confirm new password"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button onClick={handleChangePassword} disabled={isSaving}>
                          {isSaving ? "Updating..." : "Update Password"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsChangingPassword(false)
                            setCurrentPassword("")
                            setNewPassword("")
                            setConfirmPassword("")
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">Password last changed: Never</div>
                  )}
                </CardContent>
              </Card>

              {/* Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>Customize your EventHub experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Theme</Label>
                      <p className="text-sm text-muted-foreground">Choose your preferred color scheme</p>
                    </div>
                    <ModeToggle />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <Label className="text-base font-medium">Email Notifications</Label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Event Reminders</p>
                          <p className="text-xs text-muted-foreground">Get notified about upcoming events</p>
                        </div>
                        <input type="checkbox" defaultChecked className="rounded" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">New Events</p>
                          <p className="text-xs text-muted-foreground">Discover events you might like</p>
                        </div>
                        <input type="checkbox" defaultChecked className="rounded" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Booking Updates</p>
                          <p className="text-xs text-muted-foreground">Updates about your bookings</p>
                        </div>
                        <input type="checkbox" defaultChecked className="rounded" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
