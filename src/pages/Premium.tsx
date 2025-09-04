import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Sparkles, BarChart3, Brain, Calendar, Shield } from 'lucide-react';

export const Premium = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleUpgrade = async (planType: 'monthly' | 'yearly') => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to upgrade to premium.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { planType }
      });

      if (error) throw error;

      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "Could not create payment session. Please try again.",
        variant: "destructive",
      });
    }
  };
  const features = {
    free: [
      '3 daily mood entries',
      'Basic mood tracking',
      'Simple charts',
      'Mobile app access',
    ],
    premium: [
      'Unlimited mood entries',
      'Advanced analytics & insights',
      'AI-powered mood predictions',
      'Detailed trend analysis',
      'Export data functionality',
      'Premium support',
      'Dark mode & themes',
      'Calendar view',
      'Mood correlation insights',
      'Personalized recommendations',
    ]
  };

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started with mood tracking',
      features: features.free,
      cta: 'Get Started',
      popular: false,
      variant: 'outline' as const,
    },
    {
      name: 'Premium',
      price: '₺49.99',
      period: '/ay',
      description: 'Unlock powerful insights and unlimited tracking',
      features: features.premium,
      cta: 'Upgrade to Premium',
      popular: true,
      variant: 'hero' as const,
    },
    {
      name: 'Premium Yıllık',
      price: '₺499',
      period: '/yıl',
      description: 'Save 17% with our annual plan',
      features: features.premium,
      cta: 'Choose Yearly',
      popular: false,
      variant: 'secondary' as const,
      badge: 'Best Value',
    },
  ];

  const premiumBenefits = [
    {
      icon: <Brain className="h-8 w-8 text-primary" />,
      title: 'AI-Powered Insights',
      description: 'Get personalized recommendations based on your mood patterns and triggers.',
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-secondary" />,
      title: 'Advanced Analytics',
      description: 'Deep dive into your emotional patterns with detailed charts and correlations.',
    },
    {
      icon: <Calendar className="h-8 w-8 text-wellness" />,
      title: 'Calendar Integration',
      description: 'See your moods in context with events and activities from your calendar.',
    },
    {
      icon: <Shield className="h-8 w-8 text-calm" />,
      title: 'Data Export',
      description: 'Export your mood data for personal use or to share with healthcare providers.',
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-gradient-light px-4 py-2 rounded-full mb-4">
            <Crown className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium gradient-text">Premium Features</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Unlock Your <span className="gradient-text">Full Potential</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Take your wellness journey to the next level with advanced analytics, AI insights, and unlimited tracking.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative shadow-soft hover-lift ${
                plan.popular 
                  ? 'border-primary shadow-primary scale-105 lg:scale-110' 
                  : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-primary text-white px-4 py-1">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              {plan.badge && !plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-wellness text-white px-4 py-1">
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-muted-foreground mt-2">{plan.description}</p>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  variant={plan.variant} 
                  className="w-full" 
                  size="lg"
                  onClick={() => {
                    if (plan.name === 'Free') {
                      // Handle free plan selection
                      return;
                    }
                    const planType = plan.name === 'Premium Yearly' ? 'yearly' : 'monthly';
                    handleUpgrade(planType);
                  }}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Premium Benefits */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose <span className="gradient-text">Premium</span>?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Premium unlocks advanced features that help you gain deeper insights into your emotional patterns and wellness journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {premiumBenefits.map((benefit, index) => (
              <Card key={index} className="text-center hover-lift shadow-soft">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-xl bg-gradient-light">
                      {benefit.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Feature Comparison */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Feature Comparison</h2>
            <p className="text-muted-foreground">See what's included in each plan</p>
          </div>

          <Card className="shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-light">
                  <tr>
                    <th className="text-left p-4 font-semibold">Feature</th>
                    <th className="text-center p-4 font-semibold">Free</th>
                    <th className="text-center p-4 font-semibold">Premium</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="p-4">Daily mood entries</td>
                    <td className="text-center p-4">3 per day</td>
                    <td className="text-center p-4">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="p-4">Basic charts & analytics</td>
                    <td className="text-center p-4"><Check className="h-4 w-4 text-primary mx-auto" /></td>
                    <td className="text-center p-4"><Check className="h-4 w-4 text-primary mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="p-4">AI insights & predictions</td>
                    <td className="text-center p-4">—</td>
                    <td className="text-center p-4"><Check className="h-4 w-4 text-primary mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="p-4">Advanced trend analysis</td>
                    <td className="text-center p-4">—</td>
                    <td className="text-center p-4"><Check className="h-4 w-4 text-primary mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="p-4">Data export</td>
                    <td className="text-center p-4">—</td>
                    <td className="text-center p-4"><Check className="h-4 w-4 text-primary mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="p-4">Premium support</td>
                    <td className="text-center p-4">—</td>
                    <td className="text-center p-4"><Check className="h-4 w-4 text-primary mx-auto" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-primary text-white rounded-3xl p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Upgrade Your Wellness Journey?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of premium users who are gaining deeper insights into their emotional well-being.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="glassmorphism" 
              size="lg" 
              className="bg-white/20 text-white border-white/30 hover:bg-white/30"
              onClick={() => handleUpgrade('monthly')}
            >
              Start 7-Day Free Trial
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
              Compare Plans
            </Button>
          </div>

          <p className="text-sm opacity-75 mt-4">
            No credit card required • Cancel anytime • 30-day money-back guarantee
          </p>
        </section>
      </div>
    </div>
  );
};