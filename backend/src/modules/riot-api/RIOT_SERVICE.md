# Riot API Service Documentation

This document provides a comprehensive guide to the `RiotAPIService`, detailing the available methods for interacting with the Riot Games API, verified against the official documentation (as of Jan 2026).

## Overview

The `RiotAPIService` fetches data directly from the Riot Games API. It handles authentication via the `RIOT_API_KEY` and constructs appropriate URLs based on region and request parameters.

**Base URLs:**

- Platform Routing (e.g., `na1`, `euw1`): `https://{region}.api.riotgames.com`
- Regional Routing (e.g., `americas`, `europe`): `https://{server}.api.riotgames.com`

**Authentication:**

- Header: `X-Riot-Token` (Value: `RIOT_API_KEY` from config)

---

## Methods

### 1. `fetchAccountByRiotId`

Fetches the Riot Account information using the Riot ID (`gameName` and `tagLine`).

**Endpoint:**
`GET https://{server}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}`

**Note:** Uses regional routing (e.g., `americas`, `europe`).

#### Parameters

| Name       | Type     | Description                                                                      |
| :--------- | :------- | :------------------------------------------------------------------------------- |
| `region`   | `string` | The platform region (e.g., 'NA1', 'EUW1'). Used to determine the routing server. |
| `gameName` | `string` | The Riot ID game name.                                                           |
| `tagLine`  | `string` | The Riot ID tag line.                                                            |

#### Return Type

- **Type:** `Promise<any>` (Returns AccountDTO)
- **Structure:**
  ```json
  {
    "puuid": "string", // Encrypted PUUID (78 chars)
    "gameName": "string",
    "tagLine": "string"
  }
  ```

#### Example Usage

```typescript
const account = await riotService.fetchAccountByRiotId('NA1', 'MyName', 'NA1');
console.log(account.puuid);
```

---

### 2. `fetchSummonerByPuuid`

Fetches summoner information using the encrypted PUUID.

**Endpoint:**
`GET https://{region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/{encryptedPUUID}`

#### Parameters

| Name     | Type     | Description                          |
| :------- | :------- | :----------------------------------- |
| `region` | `string` | The platform region (e.g., 'NA1').   |
| `puuid`  | `string` | The Encrypted PUUID of the summoner. |

#### Return Type

- **Type:** `Promise<CreateSummonerDto>`
- **Structure:**
  ```json
  {
    "id": "string",           // Encrypted Summoner ID (Max 63 chars)
    "accountId": "string",    // Encrypted Account ID (Max 56 chars)
    "puuid": "string",        // Encrypted PUUID (Exact 78 chars)
    "profileIconId": number,  // ID of the profile icon
    "revisionDate": number,   // Last modified date (Epoch milliseconds)
    "summonerLevel": number   // Summoner level (e.g., 30)
  }
  ```

#### Example Usage

```typescript
const summoner = await riotService.fetchSummonerByPuuid(
  'NA1',
  'some-puuid-value',
);
console.log(summoner.summonerLevel);
```

---

### 3. `fetchLeagueByPuuid` ✅ (New)

Fetches league entries (rank, tier, LP) for a player using their PUUID.

**Endpoint:**
`GET https://{region}.api.riotgames.com/lol/league/v4/entries/by-puuid/{encryptedPUUID}`

#### Parameters

| Name     | Type     | Description                        |
| :------- | :------- | :--------------------------------- |
| `region` | `string` | The platform region (e.g., 'NA1'). |
| `puuid`  | `string` | The Encrypted PUUID of the player. |

#### Return Type

- **Type:** `Promise<CreateLeagueDto[]>`
- **Structure (Array of Objects):**
  ```json
  [
    {
      "leagueId": "string",
      "puuid": "string",
      "queueType": "string",   // e.g., 'RANKED_SOLO_5x5', 'RANKED_FLEX_SR'
      "tier": "string",        // e.g., 'GOLD', 'PLATINUM'
      "rank": "string",        // e.g., 'I', 'II', 'III', 'IV'
      "leaguePoints": number,
      "wins": number,
      "losses": number,
      "hotStreak": boolean,
      "veteran": boolean,
      "freshBlood": boolean,
      "inactive": boolean
    }
  ]
  ```

#### Example Usage

```typescript
const leagues = await riotService.fetchLeagueByPuuid('NA1', 'player-puuid');
const soloQueue = leagues.find((l) => l.queueType === 'RANKED_SOLO_5x5');
```

---

### 4. `fetchLeagueBySummonerId` ⚠️ (Deprecated)

> **WARNING:** This method is deprecated. The `by-summoner/{summonerId}` endpoint has been removed from the official Riot API documentation. Use `fetchLeagueByPuuid` instead.

**Endpoint (Deprecated):**
`GET https://{region}.api.riotgames.com/lol/league/v4/entries/by-summoner/{summonerId}`

---

### 5. `fetchMatchesBySummonerPuuid`

Fetches a list of match IDs for a given summoner PUUID.

**Endpoint:**
`GET https://{server}.api.riotgames.com/lol/match/v5/matches/by-puuid/{puuid}/ids`

**Note:** Uses regional routing (e.g., `americas`).

#### Parameters

| Name        | Type     | Default     | Description                                                            |
| :---------- | :------- | :---------- | :--------------------------------------------------------------------- |
| `region`    | `string` | -           | Platform region (e.g., 'NA1'), converted to regional route.            |
| `puuid`     | `string` | -           | The PUUID of the summoner.                                             |
| `start`     | `number` | `0`         | Start index for pagination.                                            |
| `count`     | `number` | `20`        | Number of match IDs to return (max 100).                               |
| `queue`     | `number` | `undefined` | Optional queue ID filter (e.g., 420 for Solo/Duo, 440 for Flex).       |
| `startTime` | `number` | `undefined` | Optional Epoch timestamp in seconds (filter matches after this time).  |
| `endTime`   | `number` | `undefined` | Optional Epoch timestamp in seconds (filter matches before this time). |

#### Return Type

- **Type:** `Promise<string[]>`
- **Structure:**
  ```json
  ["NA1_1234567890", "NA1_0987654321"]
  ```

#### Example Usage

```typescript
const matchIds = await riotService.fetchMatchesBySummonerPuuid(
  'NA1',
  'user-puuid',
  0,
  10,
);
// With filters
const rankedMatches = await riotService.fetchMatchesBySummonerPuuid(
  'NA1',
  'user-puuid',
  0,
  20,
  420,
);
```

---

### 6. `fetchMatchByMatchId`

Fetches detailed information for a specific match.

**Endpoint:**
`GET https://{server}.api.riotgames.com/lol/match/v5/matches/{matchId}`

**Note:** Uses regional routing.

#### Parameters

| Name      | Type     | Description                                   |
| :-------- | :------- | :-------------------------------------------- |
| `region`  | `string` | Platform region, converted to regional route. |
| `matchId` | `string` | The Match ID (e.g., 'NA1_1234567890').        |

#### Return Type

- **Type:** `Promise<MatchDto>`
- **Structure:**
  ```json
  {
    "metadata": {
      "dataVersion": "string",
      "matchId": "string",
      "participants": ["string"]  // List of PUUIDs
    },
    "info": {
      "gameCreation": number,
      "gameDuration": number,
      "gameMode": "string",
      "gameName": "string",
      "gameType": "string",
      "gameVersion": "string",
      "mapId": number,
      "participants": [ /* Array of Participant DTOs */ ],
      "teams": [ /* Array of Team DTOs */ ]
    }
  }
  ```

#### Example Usage

```typescript
const matchData = await riotService.fetchMatchByMatchId(
  'NA1',
  'NA1_1234567890',
);
console.log(matchData.info.gameMode);
```

---

## Utility: Region to Server Mapping

The `getServer` utility function maps specific platform regions to broader routing servers for Account and Match V5 endpoints.

| Server       | Regions                      |
| :----------- | :--------------------------- |
| **AMERICAS** | NA1, BR1, LA1, LA2           |
| **ASIA**     | KR, JP1                      |
| **EUROPE**   | EUW1, EUN1, TR1, RU, ME1     |
| **SEA**      | OC1, PH2, SG2, TH2, TW2, VN2 |

---

## Error Handling

All methods throw errors with the following HTTP status codes from the Riot API:

| Code | Description                    |
| :--- | :----------------------------- |
| 400  | Bad Request                    |
| 401  | Unauthorized (invalid API key) |
| 403  | Forbidden                      |
| 404  | Data not found                 |
| 429  | Rate limit exceeded            |
| 500  | Internal server error          |
| 503  | Service unavailable            |

---

## Migration Guide

### From `fetchLeagueBySummonerId` to `fetchLeagueByPuuid`

**Before:**

```typescript
const summoner = await riotService.fetchSummonerByPuuid(region, puuid);
const leagues = await riotService.fetchLeagueBySummonerId(region, summoner.id);
```

**After:**

```typescript
const leagues = await riotService.fetchLeagueByPuuid(region, puuid);
```

The new endpoint uses PUUID directly, eliminating the need to fetch the summoner first just to get the summoner ID for league lookups.
