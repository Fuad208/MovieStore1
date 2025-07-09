import {
  GET_USERS,
  ADD_USER,
  UPDATE_USER,
  DELETE_USER,
  TOGGLE_USER_DIALOG,
  SELECT_USER,
  SELECT_ALL_USERS,
  CLEAR_SELECTED_USERS
} from '../types/users';

const initialState = {
  users: [],
  selectedUsers: [],
  openDialog: false,
  loading: false,
  error: null
};

// Helper function for toggle selection logic (reusable)
const toggleItemInArray = (array, item) => {
  const index = array.indexOf(item);
  
  if (index === -1) {
    return [...array, item];
  }
  
  return array.filter((_, i) => i !== index);
};

const usersReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_USERS:
      return {
        ...state,
        users: Array.isArray(payload) ? payload : [],
        loading: false,
        error: null
      };
    
    case TOGGLE_USER_DIALOG:
      return {
        ...state,
        openDialog: !state.openDialog
      };
    
    case SELECT_USER:
      return {
        ...state,
        selectedUsers: toggleItemInArray(state.selectedUsers, payload)
      };
    
    case SELECT_ALL_USERS:
      return {
        ...state,
        selectedUsers: state.selectedUsers.length === state.users.length
          ? []
          : state.users.map(user => user._id)
      };
    
    case ADD_USER:
      return {
        ...state,
        users: [...state.users, payload],
        loading: false,
        error: null
      };
    
    case UPDATE_USER:
      if (!payload || !payload._id) {
        return state;
      }
      
      return {
        ...state,
        users: state.users.map(user => 
          user._id === payload._id ? { ...user, ...payload } : user
        ),
        loading: false,
        error: null
      };
    
    case DELETE_USER:
      return {
        ...state,
        users: state.users.filter(user => user._id !== payload),
        selectedUsers: state.selectedUsers.filter(id => id !== payload),
        loading: false,
        error: null
      };
    
    case CLEAR_SELECTED_USERS:
      return {
        ...state,
        selectedUsers: []
      };
    
    default:
      return state;
  }
};

export default usersReducer;