import { toast } from 'react-hot-toast';
import { setToken, clearToken } from '../redux/slices/authSlices';
import { apiConnector } from '../services/apiConnector'; 
import { authEndpoints } from '../services/apis'; 

const { SIGNUP_API, LOGIN_API,VERIFY_OTP_API } = authEndpoints;

export const signup = (firstName, lastName, email, password, navigate) => {
  return async (dispatch) => {
    const toastId = toast.loading("Creating account...");
    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        firstName,
        lastName,
        email,
        password,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Registration Successful! Please log in.");
      navigate("/login");

    } catch (error) {
      const message = error.response?.data?.message || "Registration Failed";
      toast.error(message);
    }
    toast.dismiss(toastId);
  };
};

export const verifyOtp = (email, otp, navigate) => {
    return async (dispatch) => {
        const toastId = toast.loading("Verifying OTP...");
        try {
            const response = await apiConnector("POST", VERIFY_OTP_API, {
                email,
                otp,
            });

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success("Account Verified Successfully!");
            navigate("/login"); // Redirect to login page after verification

        } catch (error) {
            const message = error.response?.data?.message || "OTP Verification Failed";
            toast.error(message);
        }
        toast.dismiss(toastId);
    };
};

export const login = (email, password, navigate) => {
  return async (dispatch) => {
    
    // toast.promise will automatically handle loading, success, and error toasts
    const promise = apiConnector("POST", LOGIN_API, { email, password });

    toast.promise(promise, {
      loading: 'Logging in...',
      success: (response) => {
        // This function runs only on a successful API call
        if (!response.data.success) {
          // If the backend sends success:false, we throw an error to trigger the error toast
          throw new Error(response.data.message);
        }
        
        // Dispatch the setToken action to save the token
        dispatch(setToken(response.data.token));
        
        // Navigate to the homepage
        navigate("/");
        
        // Return the success message for the toast
        return "Login Successful!";
      },
      error: (error) => {
        // This function runs only on a failed API call
        const message = error.response?.data?.message || "Login Failed";
        return message;
      },
    });
  };
};

export const logout = (navigate) => {
  return (dispatch) => {
    dispatch(clearToken());
    toast.success("Logged Out Successfully");
    navigate("/");
  };
};