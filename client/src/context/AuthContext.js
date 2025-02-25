import { createContext, useEffect, useReducer } from "react"

// Initial state
const INITIAL_STATE = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    loading: false,
    error: null
};

// Create Context
export const AuthContext = createContext(INITIAL_STATE)

const AuthReducer = (state,action) => {
    switch(action.type){
        // This is the state of "LOGIN_STATE"
        case "LOGIN_START": 
            return {
                user: null,
                loading: true,
                error: null
            };
            
        // This is the state of "LOGIN_STATE"
        case "LOGIN_SUCCESS": 
            return {
                user: action.payload,
                loading: false,
                error: null
            };
        // This is the state of "LOGIN_FAILURE"
        case "LOGIN_FAILURE": 
            return {
                user: null,
                loading: false,
                error: action.payload
            };
        
        // This is the state of 
        case "LOGOUT": 
            return {
                user: null,
                loading: false,
                error: null
            };

        
        default:
            return state;
    }
}



export const AuthContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE)

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(state.user));
      }, [state.user]);

    return(
        <AuthContext.Provider 
        value={{
            user: state.user, 
            loading: state.loading, 
            errors: state.error, 
            dispatch}}>
            {children}
        </AuthContext.Provider>
    )
}