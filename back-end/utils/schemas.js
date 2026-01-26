import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters'),
  email: z.string()
    .email('Invalid email format')
    .toLowerCase(),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must not exceed 100 characters')
});

export const loginSchema = z.object({
  email: z.string()
    .email('Invalid email format')
    .toLowerCase(),
  password: z.string()
    .min(1, 'Password required')
});

export const updatePlayerSchema = z.object({
  name: z.string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters')
    .optional()
});

export const createTableSchema = z.object({
  name: z.string()
    .trim()
    .min(1, 'Table name required')
    .max(100, 'Table name must not exceed 100 characters'),
  max_players: z.number()
    .int('max_players must be an integer')
    .min(1, 'min 1 player')
    .max(7, 'max 7 players')
    .optional()
    .default(4)
});

export const updateTableSchema = z.object({
  name: z.string()
    .trim()
    .min(1, 'Table name required')
    .max(100, 'Table name must not exceed 100 characters')
    .optional(),
  max_players: z.number()
    .int('max_players must be an integer')
    .min(1, 'min 1 player')
    .max(7, 'max 7 players')
    .optional()
});

export const startHandSchema = z.object({
  table_id: z.string().min(1, 'table_id required'),
  player_ids: z.array(z.string().min(1))
    .min(1, 'At least 1 player required'),
  bet_amounts: z.array(z.number().min(10, 'Minimum bet is $10').max(1000, 'Maximum bet is $1000'))
    .min(1, 'Bet amounts required')
});

export const playerHitSchema = z.object({
  hand_player_id: z.string().min(1, 'hand_player_id required')
});

export const playerStandSchema = z.object({
  hand_player_id: z.string().min(1, 'hand_player_id required')
});

export const dealerPlaySchema = z.object({
  hand_id: z.string().min(1, 'hand_id required')
});
