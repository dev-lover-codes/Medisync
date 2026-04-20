/**
 * API Service for interacting with Supabase and external endpoints.
 * @module api
 */

import { createClient } from '@supabase/supabase-js';
import logger from '../../utils/logger';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  logger.error('Supabase URL or Anon Key is missing in environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Maps Supabase errors to standard HTTP status codes and consistent error objects.
 * @param {Object} error - The Supabase error object.
 * @returns {Object} Consistent error response.
 */
const handleApiError = (error) => {
  let status = 500;
  let message = 'Internal Server Error';

  if (error.code) {
    if (error.code === '42501') {
      status = 403;
      message = 'Forbidden: Insufficient privileges.';
    } else if (error.code.startsWith('23')) {
      status = 409;
      message = 'Conflict: Data constraint violation.';
    } else if (error.code === 'PGRST116') {
      status = 404;
      message = 'Not Found: Resource does not exist.';
    } else {
      status = 400;
      message = `Bad Request: ${error.message}`;
    }
  } else if (error.message) {
    status = 400;
    message = error.message;
  }

  return {
    success: false,
    status,
    error: {
      message,
      details: error.details || error.hint || error.message,
      code: error.code || 'UNKNOWN'
    },
    data: null
  };
};

/**
 * Validates input data based on a simple type check.
 * @param {Object} payload - The data to validate.
 * @throws {Error} If validation fails.
 */
const validateInput = (payload) => {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid payload: Must be an object.');
  }
  Object.keys(payload).forEach(key => {
    if (payload[key] === undefined) {
      throw new Error(`Invalid payload: Field "${key}" cannot be undefined.`);
    }
  });
};

/**
 * Generic wrapper for Supabase database calls with validation and standard HTTP-like error handling.
 * @param {string} operation - The operation type ('select', 'insert', 'update', 'delete').
 * @param {string} table - The database table name.
 * @param {Object} [data=null] - The payload to insert or update.
 * @param {Object} [options={}] - Additional query options (e.g., filters).
 * @returns {Promise<Object>} Standardized response object { success, status, data, error }.
 */
export const dbCall = async (operation, table, data = null, options = {}) => {
  try {
    if (data) validateInput(data);

    let query = supabase.from(table);

    switch (operation) {
      case 'select':
        query = query.select(options.select || '*');
        if (options.filters) {
          Object.entries(options.filters).forEach(([key, value]) => {
            query = query.eq(key, value);
          });
        }
        if (options.single) {
          query = query.single();
        }
        break;
      case 'insert':
        query = query.insert(data).select();
        break;
      case 'update':
        query = query.update(data).select();
        if (options.filters) {
          Object.entries(options.filters).forEach(([key, value]) => {
            query = query.eq(key, value);
          });
        }
        break;
      case 'delete':
        query = query.delete().select();
        if (options.filters) {
          Object.entries(options.filters).forEach(([key, value]) => {
            query = query.eq(key, value);
          });
        }
        break;
      default:
        throw new Error(`Unsupported operation: ${operation}`);
    }

    const { data: result, error } = await query;

    if (error) {
      logger.error(`Supabase Error [${operation} on ${table}]:`, error);
      return handleApiError(error);
    }

    return {
      success: true,
      status: operation === 'insert' ? 201 : 200,
      data: result,
      error: null
    };

  } catch (err) {
    logger.error(`API Service Exception:`, err.message);
    return handleApiError(err);
  }
};

export default {
  supabase,
  dbCall
};
