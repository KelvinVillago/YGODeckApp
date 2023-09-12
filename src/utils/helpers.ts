export function handleInputChange<T>(
    e: React.ChangeEvent<HTMLInputElement>, 
    originalObj: T, 
    stateSetter: React.Dispatch<React.SetStateAction<T>>
){
    stateSetter({...originalObj, [e.target.name] : e.target.value})
}