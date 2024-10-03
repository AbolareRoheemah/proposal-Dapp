'use client'
import React, { createContext, useState, useEffect } from 'react';

export const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
    const [loading, setLoading] = useState(false)
    const [voteLoading, setVoteLoading] = useState(false)

    return (
        <GlobalStateContext.Provider value={{ loading, setLoading, voteLoading, setVoteLoading}}>
            {children}
        </GlobalStateContext.Provider>
    );
}