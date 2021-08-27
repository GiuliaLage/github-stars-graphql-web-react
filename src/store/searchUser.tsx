import React, { useState, createContext } from 'react';

interface ProviderProps {
  children: JSX.Element[] | JSX.Element;
}

// eslint-disable-next-line
export const SearchUserContext = createContext<any>({});

export const SearchUserProvider: React.FC<ProviderProps> = (
  props: ProviderProps,
) => {
  const [searchUser, setSearchUser] = useState<string>('');
  const { children } = props;

  return (
    <SearchUserContext.Provider value={{ searchUser, setSearchUser }}>
      {children}
    </SearchUserContext.Provider>
  );
};
