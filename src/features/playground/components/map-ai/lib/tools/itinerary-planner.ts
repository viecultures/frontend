/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { FunctionCall } from '../state';
import type { FunctionResponseScheduling } from '@google/genai';

export const itineraryPlannerTools: FunctionCall[] = [
  {
    name: 'mapsGrounding',
    description: `
    A tool for deep exploration of SPECIFIC venues (restaurants, museums, etc.) WITHIN a city. You are STRICTLY FORBIDDEN from using this tool for general city-level navigation or geographic lookups (e.g., "go to Paris"). For cities, you MUST use 'frameEstablishingShot' instead. This tool is for places only.

    1.  **For Itinerary Planning:** Find and summarize information about places like restaurants, museums, or parks. Use a straightforward query to get factual summaries of top results. It can also be used to answer specific questions about a place (e.g., "Does Kuma serve California rolls?") by searching its reviews, snippets, and attributes.
        -   **Example Query:** "fun museums in Paris" or "best pizza in Brooklyn".

    2.  **For Creative Content:** Generate engaging narratives, riddles, or scavenger hunt clues based on real-world location data. Use a descriptive query combined with a custom 'systemInstruction' to guide the creative output.
        -   **Example Query:** "a famous historical restaurant in Paris".

    Args:
        query: A string describing the search parameters. You **MUST be as precise as possible**, include as much location data that you can such as city, state and/or country to reduce ambiguous results.
        markerBehavior: (Optional) Controls map markers. "mentioned" (default), "all", or "none".
        systemInstruction: (Optional) A string that provides a persona and instructions for the tool's output. Use this for creative tasks to ensure the response is formatted as a clue, riddle, etc.

    Returns:
        A response from the maps grounding agent. The content and tone of the response will be shaped by the query and the optional 'systemInstruction'.
    `,
    parameters: {
      type: 'OBJECT',
      properties: {
        query: {
          type: 'STRING',
          description:
            'A query to search for places (e.g., "Japanese restaurants in Tokyo", "parks in Sydney").',
        },
        markerBehavior: {
          type: 'STRING',
          description:
            'Controls how markers are placed on the map. Options: "mentioned" (default, places markers for locations named in the final response), "all" (places markers for all search results), "none" (no markers placed).',
          enum: ['mentioned', 'all', 'none'],
        },
        systemInstruction: {
          type: 'STRING',
          description:
            'A custom instruction to shape the model\'s output. Use this to adopt a specific persona, generate creative content (like riddles or clues), or enforce a particular format. This is NOT for the main search query.',
        },
      },
      required: ['query'],
    },
    isEnabled: true,
  },
  {
    name: 'frameLocations',
    description:
      "Adjusts the map's camera to frame one or more specific locations, optionally clearing existing markers.",
    parameters: {
      type: 'OBJECT',
      properties: {
        locations: {
          type: 'ARRAY',
          description: 'A list of location names to frame.',
          items: {
            type: 'STRING',
          },
        },
        clearMarkers: {
          type: 'BOOLEAN',
          description:
            'If true, clears existing markers from the map before framing the new locations.',
        },
      },
      required: ['locations'],
    },
    isEnabled: true,
  },
  {
    name: 'frameEstablishingShot',
    description:
      'Moves the map camera to a high-level view of a major geographical feature (city, state, country, or landmark). Use this immediately when the user mentions a new destination to set the scene, BEFORE searching for specific places.',
    parameters: {
      type: 'OBJECT',
      properties: {
        location: {
          type: 'STRING',
          description:
            'The name of the city, region, country, or major landmark to frame (e.g., "Paris", "California", "Japan", "Eiffel Tower").',
        },
      },
      required: ['location'],
    },
    isEnabled: true,
    scheduling: 'INTERRUPT' as unknown as FunctionResponseScheduling,
  },
];