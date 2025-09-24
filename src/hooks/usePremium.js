// src/hooks/usePremium.js
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export const usePremium = () => {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    if (user?.id) {
      checkPremiumStatus();
    } else {
      setIsPremium(false);
      setLoading(false);
    }
  }, [user?.id]);

  const checkPremiumStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        const endDate = new Date(data.end_date);
        const now = new Date();
        
        if (endDate > now) {
          setIsPremium(true);
          setSubscription(data);
        } else {
          setIsPremium(false);
          // Update expired subscription
          await supabase
            .from('subscriptions')
            .update({ status: 'expired' })
            .eq('id', data.id);
        }
      } else {
        setIsPremium(false);
      }
    } catch (error) {
      console.error('Error checking premium status:', error);
      setIsPremium(false);
    } finally {
      setLoading(false);
    }
  };

  return {
    isPremium,
    loading,
    subscription,
    checkPremiumStatus
  };
};