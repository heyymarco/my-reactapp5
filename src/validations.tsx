import
    React, {
    createContext
}                          from 'react';



/**
 * Validation was skipped because its not required. Neither success nor error shown.
 */
export type Nocheck = null
/**
 * Validation result was failed because the value is not meet the criteria.
 */
export type Error   = false
/**
 * Validation result was successful and the value is meet the criteria.
 */
export type Success = true
export type Result  = Nocheck|Error|Success;



export interface Validation {
    /**
     * `undefined` : same as `true`.  
     * `true`      : validation feature is enabled, preserve `isValid` prop.  
     * `false`     : validation feature is disabled, equivalent as `isValid = null` (*uncheck*).  
     */
    enableValidation? : boolean

    /**
     * `undefined` : automatic detect valid/invalid state.  
     * `null`      : force validation state to *no check*.  
     * `true`      : force validation state to *valid*.  
     * `false`     : force validation state to *invalid*.  
     */
    isValid?          : Result
}
export const Context = createContext<Validation>({
    enableValidation : true,
    isValid          : undefined,
});
Context.displayName  = 'Validation';



export interface Props
    extends
        Validation
{
    // validations:
    enableValidation? : boolean

    // children:
    children?         : React.ReactNode
}
export default function ValidationProvider(props: Props) {
    return (
        <Context.Provider value={{
            enableValidation : props.enableValidation ?? true,
            isValid          : props.isValid,
        }}>
            {props.children}
        </Context.Provider>
    );
}