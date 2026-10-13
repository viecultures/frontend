/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { createContext, type FC, type ReactNode, useContext } from 'react';
import { useLiveApi, type UseLiveApiResults } from '../hooks/use-live-api';
import { useSettings } from '../lib/state';
import type { ActiveView } from '../lib/session-controller';

const LiveAPIContext = createContext<UseLiveApiResults | undefined>(undefined);

export type LiveAPIProviderProps = {
  children: ReactNode;
  activeView: ActiveView;
};

export const LiveAPIProvider: FC<LiveAPIProviderProps> = ({
  activeView,
  children,
}) => {
  const customGeminiApiKey = useSettings(state => state.customGeminiApiKey);
  const apiKey = customGeminiApiKey || import.meta.env.VITE_GEMINI_API_KEY || '';
  const liveAPI = useLiveApi({ apiKey, activeView });

  return (
    <LiveAPIContext.Provider value={liveAPI}>
      {children}
    </LiveAPIContext.Provider>
  );
};

export const useLiveAPIContext = () => {
  const context = useContext(LiveAPIContext);
  if (!context) {
    throw new Error('useLiveAPIContext must be used within a LiveAPIProvider');
  }
  return context;
};
