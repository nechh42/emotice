import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Users, 
  MessageCircle, 
  Heart, 
  Share2, 
  Plus,
  Crown,
  Shield,
  Sparkles,
  Clock
} from 'lucide-react';

export const Community = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [newPost, setNewPost] = useState('');

  React.useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) return null;

  // Mock community posts data
  const communityPosts = [
    {
      id: '1',
      author: {
        name: 'Sarah Johnson',
        avatar: '',
        badge: 'Wellness Coach',
        isPremium: true
      },
      content: 'Today marks my 30-day streak of daily mood tracking! The insights have been incredible. I\'ve noticed I feel most positive on days when I start with meditation. What patterns have you discovered? 🌟',
      mood: '😊',
      likes: 24,
      comments: 8,
      timeAgo: '2h ago',
      tags: ['streak', 'meditation', 'positivity']
    },
    {
      id: '2',
      author: {
        name: 'Anonymous Butterfly',
        avatar: '',
        badge: 'Community Helper',
        isPremium: false
      },
      content: 'Feeling anxious about work presentations. Any tips for managing anxiety? The breathing exercises in the app have helped a bit, but I could use more strategies.',
      mood: '😰',
      likes: 12,
      comments: 15,
      timeAgo: '4h ago',
      tags: ['anxiety', 'work', 'support']
    },
    {
      id: '3',
      author: {
        name: 'Mike Chen',
        avatar: '',
        badge: 'Mindfulness Advocate',
        isPremium: true
      },
      content: 'The astrology insights feature is amazing! Yesterday\'s new moon guidance about new beginnings really resonated with me. Started a new fitness routine and feeling great! 💪',
      mood: '🌟',
      likes: 18,
      comments: 6,
      timeAgo: '6h ago',
      tags: ['astrology', 'fitness', 'new-moon']
    }
  ];

  const supportGroups = [
    {
      id: '1',
      name: 'Anxiety Support Circle',
      members: 342,
      description: 'A safe space to share experiences and coping strategies for anxiety',
      mood: '💙',
      isJoined: true
    },
    {
      id: '2',
      name: 'Mindfulness & Meditation',
      members: 567,
      description: 'Daily meditation practices and mindfulness techniques',
      mood: '🧘‍♀️',
      isJoined: false
    },
    {
      id: '3',
      name: 'Workplace Wellness',
      members: 234,
      description: 'Managing stress and maintaining mental health at work',
      mood: '💼',
      isJoined: true
    },
    {
      id: '4',
      name: 'Self-Care Champions',
      members: 445,
      description: 'Sharing self-care routines and celebrating small wins',
      mood: '✨',
      isJoined: false
    }
  ];

  const handleSubmitPost = () => {
    if (newPost.trim()) {
      // Here would be the actual post submission logic
      console.log('New post:', newPost);
      setNewPost('');
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 gradient-text">
            {t('community.title', 'Community & Support')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('community.subtitle', 'Connect with others on their wellness journey. Share experiences, find support, and grow together.')}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create New Post */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  <span>{t('community.shareThoughts', 'Share Your Thoughts')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-3">
                  <Avatar>
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback>
                      {user?.user_metadata?.full_name?.[0] || user?.email?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder={t('community.postPlaceholder', 'Share your mood, insights, or ask for support...')}
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      className="min-h-[100px] resize-none"
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      <Shield className="h-3 w-3 mr-1" />
                      {t('community.anonymous', 'Anonymous posting available')}
                    </Badge>
                  </div>
                  <Button onClick={handleSubmitPost} disabled={!newPost.trim()}>
                    <Plus className="h-4 w-4 mr-2" />
                    {t('community.post', 'Post')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Community Posts */}
            <div className="space-y-4">
              {communityPosts.map((post) => (
                <Card key={post.id} className="shadow-soft hover-lift">
                  <CardContent className="pt-6">
                    <div className="flex space-x-3 mb-4">
                      <Avatar>
                        <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium">{post.author.name}</span>
                          {post.author.isPremium && (
                            <Crown className="h-4 w-4 text-yellow-500" />
                          )}
                          <Badge variant="outline" className="text-xs">
                            {post.author.badge}
                          </Badge>
                          <div className="text-2xl">{post.mood}</div>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{post.timeAgo}</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm mb-4 leading-relaxed">{post.content}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" className="text-muted-foreground">
                          <Heart className="h-4 w-4 mr-1" />
                          {post.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {post.comments}
                        </Button>
                      </div>
                      <Button variant="ghost" size="sm" className="text-muted-foreground">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Support Groups */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-secondary" />
                  <span>{t('community.supportGroups', 'Support Groups')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {supportGroups.map((group) => (
                  <div key={group.id} className="p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="text-lg">{group.mood}</div>
                        <div>
                          <h4 className="font-medium text-sm">{group.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {group.members} {t('community.members', 'members')}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{group.description}</p>
                    <Button 
                      size="sm" 
                      variant={group.isJoined ? "outline" : "secondary"} 
                      className="w-full text-xs"
                    >
                      {group.isJoined ? t('community.joined', 'Joined') : t('community.join', 'Join')}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Community Guidelines */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-wellness" />
                  <span>{t('community.guidelines', 'Community Guidelines')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="space-y-2">
                  <p className="flex items-start space-x-2">
                    <span className="text-primary">•</span>
                    <span>{t('community.guideline1', 'Be respectful and supportive of others')}</span>
                  </p>
                  <p className="flex items-start space-x-2">
                    <span className="text-primary">•</span>
                    <span>{t('community.guideline2', 'Share experiences, not medical advice')}</span>
                  </p>
                  <p className="flex items-start space-x-2">
                    <span className="text-primary">•</span>
                    <span>{t('community.guideline3', 'Protect privacy - yours and others')}</span>
                  </p>
                  <p className="flex items-start space-x-2">
                    <span className="text-primary">•</span>
                    <span>{t('community.guideline4', 'Report inappropriate content')}</span>
                  </p>
                </div>
                <div className="pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    {t('community.crisis', 'In crisis? Contact')} 
                    <a href="tel:988" className="text-primary ml-1">988</a>
                    {t('community.crisisLine', ' (Suicide & Crisis Lifeline)')}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Premium Community Features */}
            <Card className="shadow-soft bg-gradient-light">
              <CardContent className="pt-6">
                <div className="text-center space-y-3">
                  <Sparkles className="h-8 w-8 text-primary mx-auto" />
                  <h3 className="font-semibold">{t('community.premiumTitle', 'Premium Community')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('community.premiumDesc', 'Join exclusive groups, get priority support, and access advanced community features.')}
                  </p>
                  <Button variant="hero" size="sm" onClick={() => navigate('/premium')}>
                    {t('community.upgrade', 'Upgrade Now')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};