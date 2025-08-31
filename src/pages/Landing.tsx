import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Smartphone, BarChart3, Shield, Star, ArrowRight } from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';
import moodPreview from '@/assets/mood-preview.jpg';

export const Landing = () => {
  const features = [
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: 'Track Your Emotions',
      description: 'Log your daily moods with our intuitive emoji-based interface',
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-secondary" />,
      title: 'Visualize Patterns',
      description: 'Understand your emotional patterns with beautiful charts and insights',
    },
    {
      icon: <Smartphone className="h-8 w-8 text-wellness" />,
      title: 'Mobile Optimized',
      description: 'Track your mood anywhere with our responsive mobile design',
    },
    {
      icon: <Shield className="h-8 w-8 text-calm" />,
      title: 'Private & Secure',
      description: 'Your emotional data is encrypted and completely private',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      text: 'Emotice helped me understand my mood patterns and improve my mental health.',
      rating: 5,
    },
    {
      name: 'Mike Johnson',
      text: 'The insights I get from tracking my emotions daily have been life-changing.',
      rating: 5,
    },
    {
      name: 'Emily Rodriguez',
      text: 'Beautiful design and so easy to use. I never miss a day now!',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 lg:pt-24 lg:pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Track Your <span className="gradient-text">Emotions</span><br />
                  Improve Your <span className="gradient-text">Wellness</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-lg">
                  Join thousands of users who are improving their mental health by tracking their daily moods and emotions with Emotice.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="lg" className="group">
                  Start Tracking Today
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </div>

              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">10K+</div>
                  <div className="text-sm text-muted-foreground">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">4.9★</div>
                  <div className="text-sm text-muted-foreground">App Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-wellness">50M+</div>
                  <div className="text-sm text-muted-foreground">Mood Entries</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-3xl opacity-20 animate-pulse" />
              <img
                src={heroImage}
                alt="Emotice App Preview"
                className="relative rounded-3xl shadow-primary hover-lift float"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose <span className="gradient-text">Emotice</span>?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our app combines beautiful design with powerful features to help you understand and improve your emotional well-being.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover-lift shadow-soft">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-xl bg-gradient-light">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mood Preview Section */}
      <section className="py-16 lg:py-20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img
                src={moodPreview}
                alt="Mood Tracking Interface"
                className="rounded-3xl shadow-primary hover-lift"
              />
            </div>
            
            <div className="order-1 lg:order-2 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Simple & Intuitive <span className="gradient-text">Mood Tracking</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Select your mood with beautiful emoji interfaces, add personal notes, and watch your emotional patterns emerge over time.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>6 core emotions with emoji representations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-secondary rounded-full" />
                  <span>Personal notes for context and reflection</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-wellness rounded-full" />
                  <span>Beautiful charts showing your emotional journey</span>
                </div>
              </div>

              <Button variant="hero" size="lg">
                Try Mood Tracking
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Loved by <span className="gradient-text">Thousands</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              See what our users are saying about their wellness journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover-lift shadow-soft">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.text}"</p>
                  <p className="font-semibold">{testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-gradient-primary text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Wellness Journey?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of users who are already improving their mental health with Emotice.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="glassmorphism" size="lg" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              Get Started Free
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};