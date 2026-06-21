export const initialStore=()=>{
  return{
    tags: []
  }
}

export default function storeReducer(store, action = {}) {
  switch(action.type){
    case 'all_tags':
    return {
        ...store,
        tags: action.payload
    };

    
    default:
			throw Error('Unknown action.');
  }    
}
