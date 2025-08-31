import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Bell, 
  Shield, 
  Crown, 
  Download,
  Trash2,
  Edit2,
  Camera
} from 'lucide-react';

export const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    bio: 'Wellness enthusiast focused on mental health and emotional well-being.',
    joinDate: 'January 15, 2024',
    isPremium: false,
  });

  const [notifications, setNotifications] = useState({
    dailyReminders: true,
    weeklyReports: true,
    insights: false,
    marketing: false,
  });

  const [privacy, setPrivacy] = useState({
    dataSharing: false,
    analytics: true,
    profileVisibility: false,
  });

  const stats = {
    totalEntries: 142,
    currentStreak: 12,
    longestStreak: 28,
    joinedDaysAgo: 45,
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    // TODO: Implement profile update logic
    console.log('Profile updated:', profile);
  };

  const handleExportData = () => {
    // TODO: Implement data export
    console.log('Exporting user data...');
  };

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion
    console.log('Account deletion requested...');
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Profile Settings</h1>
          <p className="text-lg text-muted-foreground">
            Manage your account, preferences, and privacy settings
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Profile Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information */}
            <Card className="shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-primary" />
                  <span>Profile Information</span>
                </CardTitle>
                <Button
                  variant={isEditing ? 'default' : 'outline'}
                  size="sm"
                  onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
                >
                  {isEditing ? 'Save Changes' : <><Edit2 className="h-4 w-4 mr-2" />Edit</>}
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src="" />
                      <AvatarFallback className="text-xl bg-gradient-primary text-white">
                        {profile.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{profile.name}</h3>
                    <p className="text-muted-foreground">{profile.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant={profile.isPremium ? 'default' : 'secondary'}>
                        {profile.isPremium ? (
                          <><Crown className="h-3 w-3 mr-1" />Premium</>
                        ) : (
                          'Free Plan'
                        )}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                    disabled={!isEditing}
                    className="min-h-[80px]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-primary" />
                  <span>Notification Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Daily Mood Reminders</Label>
                    <p className="text-sm text-muted-foreground">Get reminded to log your mood</p>
                  </div>
                  <Switch
                    checked={notifications.dailyReminders}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, dailyReminders: checked }))
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">Receive weekly mood summaries</p>
                  </div>
                  <Switch
                    checked={notifications.weeklyReports}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, weeklyReports: checked }))
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>AI Insights</Label>
                    <p className="text-sm text-muted-foreground">Get personalized insights {!profile.isPremium && '(Premium only)'}</p>
                  </div>
                  <Switch
                    checked={notifications.insights}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, insights: checked }))
                    }
                    disabled={!profile.isPremium}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Marketing Communications</Label>
                    <p className="text-sm text-muted-foreground">Tips and product updates</p>
                  </div>
                  <Switch
                    checked={notifications.marketing}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, marketing: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>Privacy & Security</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Anonymous Data Sharing</Label>
                    <p className="text-sm text-muted-foreground">Help improve the app with anonymous data</p>
                  </div>
                  <Switch
                    checked={privacy.dataSharing}
                    onCheckedChange={(checked) => 
                      setPrivacy(prev => ({ ...prev, dataSharing: checked }))
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Usage Analytics</Label>
                    <p className="text-sm text-muted-foreground">Allow collection of usage statistics</p>
                  </div>
                  <Switch
                    checked={privacy.analytics}
                    onCheckedChange={(checked) => 
                      setPrivacy(prev => ({ ...prev, analytics: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" onClick={handleExportData} className="w-full justify-start">
                  <Download className="mr-2 h-4 w-4" />
                  Export My Data
                </Button>
                
                <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                  Change Password
                </Button>
                
                <Separator />
                
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteAccount}
                  className="w-full justify-start"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            {/* Account Stats */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Your Journey</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{stats.totalEntries}</div>
                  <div className="text-sm text-muted-foreground">Total Entries</div>
                </div>
                
                <Separator />
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">{stats.currentStreak}</div>
                  <div className="text-sm text-muted-foreground">Current Streak</div>
                </div>
                
                <Separator />
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-wellness">{stats.longestStreak}</div>
                  <div className="text-sm text-muted-foreground">Longest Streak</div>
                </div>
                
                <Separator />
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-calm">{stats.joinedDaysAgo}</div>
                  <div className="text-sm text-muted-foreground">Days with Emotice</div>
                </div>
              </CardContent>
            </Card>

            {/* Premium Upgrade */}
            {!profile.isPremium && (
              <Card className="shadow-soft bg-gradient-light">
                <CardContent className="pt-6 text-center">
                  <Crown className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Upgrade to Premium</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Unlock advanced features and deeper insights
                  </p>
                  <Button variant="hero" className="w-full">
                    Upgrade Now
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Account Info */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Joined {profile.joinDate}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>Email verified</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span>2FA disabled</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};