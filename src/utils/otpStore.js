import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zrvcptwbjgqleutuzexc.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpydmNwdHdiamdxbGV1dHV6ZXhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxODI3MDEsImV4cCI6MjAzMzc1ODcwMX0.NMqQMZt0wZkVeVk8zuxpn7NxNaDcLiRLf_7NtvgGgow"
const supabase = createClient(supabaseUrl, supabaseKey);

export async function storeOtp(phoneNumber, otp) {
    const expiresIn = new Date(Date.now() + 300000); // OTP valid for 5 minutes

    try {
        const { data, error } = await supabase.from('otps').insert([
            { phoneNumber, otp }
        ]);

        if (error) {
            console.error('Failed to store OTP in Supabase:', error);
            throw new Error('Failed to store OTP');
        }

        console.log('OTP stored successfully in Supabase:', data);
    } catch (error) {
        console.error('Error storing OTP:', error);
        throw error;
    }
}

export async function getOtp(phoneNumber) {
    try {
        const { data, error } = await supabase
            .from('otps')
            .select('otpHash, expiresIn')
            .eq('phoneNumber', phoneNumber)
            .single();

        if (error) {
            console.error('Failed to fetch OTP from Supabase:', error);
            throw new Error('Failed to fetch OTP');
        }

        return data;
    } catch (error) {
        console.error('Error fetching OTP:', error);
        throw error;
    }
}

export async function removeOtp(phoneNumber) {
    try {
        const { error } = await supabase
            .from('otps')
            .delete()
            .eq('phoneNumber', phoneNumber);

        if (error) {
            console.error('Failed to delete OTP from Supabase:', error);
            throw new Error('Failed to delete OTP');
        }

        console.log('OTP deleted successfully from Supabase');
    } catch (error) {
        console.error('Error deleting OTP:', error);
        throw error;
    }
}
