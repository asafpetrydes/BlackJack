import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blackjack Multiplayer API',
      version: '1.0.0',
      description: 'Real-time multiplayer Blackjack game API with WebSocket support',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Development server',
      },
    ],
    tags: [
      {
        name: 'Health',
        description: 'Health check endpoints',
      },
      {
        name: 'Players',
        description: 'Player management endpoints',
      },
      {
        name: 'Tables',
        description: 'Table management endpoints',
      },
      {
        name: 'Game',
        description: 'Game logic and actions',
      },
    ],
    paths: {
      '/': {
        get: {
          tags: ['Health'],
          summary: 'Health check endpoint',
          responses: {
            '200': {
              description: 'Server is running',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      version: { type: 'string' },
                      documentation: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/health': {
        get: {
          tags: ['Health'],
          summary: 'Detailed health check',
          responses: {
            '200': {
              description: 'Server health status',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string' },
                      timestamp: { type: 'string' },
                      uptime: { type: 'number' },
                      environment: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/players': {
        get: {
          tags: ['Players'],
          summary: 'Get all players',
          responses: {
            '200': {
              description: 'List of all players',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Player' }
                  }
                }
              }
            }
          }
        },
        post: {
          tags: ['Players'],
          summary: 'Create a new player',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name'],
                  properties: {
                    name: { type: 'string', example: 'John Doe' },
                    balance: { type: 'number', example: 1000 }
                  }
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'Player created successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Player' }
                }
              }
            },
            '400': {
              description: 'Validation error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' }
                }
              }
            }
          }
        }
      },
      '/api/players/{id}': {
        get: {
          tags: ['Players'],
          summary: 'Get a player by ID',
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'string' },
              description: 'Player ID'
            }
          ],
          responses: {
            '200': {
              description: 'Player found',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Player' }
                }
              }
            },
            '404': {
              description: 'Player not found',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' }
                }
              }
            }
          }
        },
        put: {
          tags: ['Players'],
          summary: 'Update a player',
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'string' }
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    balance: { type: 'number' }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Player updated successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Player' }
                }
              }
            },
            '404': {
              description: 'Player not found',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' }
                }
              }
            }
          }
        },
        delete: {
          tags: ['Players'],
          summary: 'Delete a player',
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'string' }
            }
          ],
          responses: {
            '200': {
              description: 'Player deleted successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      player: { $ref: '#/components/schemas/Player' }
                    }
                  }
                }
              }
            },
            '404': {
              description: 'Player not found',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' }
                }
              }
            }
          }
        }
      },
      '/api/players/{id}/stats': {
        get: {
          tags: ['Players'],
          summary: 'Get player statistics',
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'string' }
            }
          ],
          responses: {
            '200': {
              description: 'Player statistics',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      player_id: { type: 'string' },
                      name: { type: 'string' },
                      balance: { type: 'number' },
                      total_hands_played: { type: 'number' },
                      total_hands_won: { type: 'number' },
                      total_hands_lost: { type: 'number' },
                      win_rate: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/tables': {
        get: {
          tags: ['Tables'],
          summary: 'Get all tables',
          responses: {
            '200': {
              description: 'List of all tables',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Table' }
                  }
                }
              }
            }
          }
        },
        post: {
          tags: ['Tables'],
          summary: 'Create a new table',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name'],
                  properties: {
                    name: { type: 'string', example: 'VIP Table 1' },
                    max_players: { type: 'number', example: 4, minimum: 1, maximum: 7 }
                  }
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'Table created successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Table' }
                }
              }
            }
          }
        }
      },
      '/api/tables/{id}': {
        get: {
          tags: ['Tables'],
          summary: 'Get a table by ID',
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'string' }
            }
          ],
          responses: {
            '200': {
              description: 'Table found',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Table' }
                }
              }
            },
            '404': {
              description: 'Table not found',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' }
                }
              }
            }
          }
        },
        put: {
          tags: ['Tables'],
          summary: 'Update a table',
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'string' }
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    max_players: { type: 'number' },
                    status: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'FULL', 'MAINTENANCE'] }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Table updated successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Table' }
                }
              }
            }
          }
        },
        delete: {
          tags: ['Tables'],
          summary: 'Delete a table',
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'string' }
            }
          ],
          responses: {
            '200': {
              description: 'Table deleted successfully'
            }
          }
        }
      },
      '/api/tables/{id}/players': {
        get: {
          tags: ['Tables'],
          summary: 'Get all players at a table',
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'string' }
            }
          ],
          responses: {
            '200': {
              description: 'List of players at the table',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      table: { $ref: '#/components/schemas/Table' },
                      players: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Player' }
                      },
                      hand_id: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/game/start': {
        post: {
          tags: ['Game'],
          summary: 'Start a new hand',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['table_id', 'player_ids', 'bet_amounts'],
                  properties: {
                    table_id: { type: 'string', example: '60d5ec49f1b2c72b8c8e4f3a' },
                    player_ids: {
                      type: 'array',
                      items: { type: 'string' },
                      example: ['60d5ec49f1b2c72b8c8e4f3b', '60d5ec49f1b2c72b8c8e4f3c']
                    },
                    bet_amounts: {
                      type: 'array',
                      items: { type: 'number' },
                      example: [100, 200]
                    }
                  }
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'Hand started successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      hand_id: { type: 'string' },
                      status: { type: 'string' },
                      dealer_cards: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Card' }
                      },
                      players: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            hand_player_id: { type: 'string' },
                            player_id: { type: 'string' },
                            player_name: { type: 'string' },
                            bet_amount: { type: 'number' },
                            cards: {
                              type: 'array',
                              items: { $ref: '#/components/schemas/Card' }
                            },
                            hand_value: { type: 'number' },
                            status: { type: 'string' }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            '400': {
              description: 'Invalid request',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' }
                }
              }
            }
          }
        }
      },
      '/api/game/hit': {
        post: {
          tags: ['Game'],
          summary: 'Player hits (draws a card)',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['hand_player_id'],
                  properties: {
                    hand_player_id: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Card drawn successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      hand_player_id: { type: 'string' },
                      cards: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Card' }
                      },
                      hand_value: { type: 'number' },
                      status: { type: 'string' },
                      new_card: { $ref: '#/components/schemas/Card' }
                    }
                  }
                }
              }
            },
            '404': {
              description: 'HandPlayer not found',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' }
                }
              }
            }
          }
        }
      },
      '/api/game/stand': {
        post: {
          tags: ['Game'],
          summary: 'Player stands',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['hand_player_id'],
                  properties: {
                    hand_player_id: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Player stood successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      hand_player_id: { type: 'string' },
                      status: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/game/double-down': {
        post: {
          tags: ['Game'],
          summary: 'Player doubles down',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['hand_player_id'],
                  properties: {
                    hand_player_id: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Doubled down successfully'
            },
            '400': {
              description: 'Insufficient balance',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' }
                }
              }
            }
          }
        }
      },
      '/api/game/split': {
        post: {
          tags: ['Game'],
          summary: 'Player splits a pair',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['hand_player_id'],
                  properties: {
                    hand_player_id: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Hand split successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      original_hand_player: {
                        type: 'object',
                        properties: {
                          hand_player_id: { type: 'string' },
                          cards: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Card' }
                          },
                          hand_value: { type: 'number' }
                        }
                      },
                      new_hand_player: {
                        type: 'object',
                        properties: {
                          hand_player_id: { type: 'string' },
                          cards: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Card' }
                          },
                          hand_value: { type: 'number' }
                        }
                      }
                    }
                  }
                }
              }
            },
            '400': {
              description: 'Cannot split (not a pair or insufficient balance)',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' }
                }
              }
            }
          }
        }
      },
      '/api/game/dealer-play': {
        post: {
          tags: ['Game'],
          summary: 'Dealer plays their hand',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['hand_id'],
                  properties: {
                    hand_id: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Dealer finished playing',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      hand_id: { type: 'string' },
                      status: { type: 'string' },
                      dealer_cards: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Card' }
                      },
                      dealer_value: { type: 'number' },
                      dealer_busted: { type: 'boolean' },
                      results: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            hand_player_id: { type: 'string' },
                            player_name: { type: 'string' },
                            cards: {
                              type: 'array',
                              items: { $ref: '#/components/schemas/Card' }
                            },
                            hand_value: { type: 'number' },
                            result: { type: 'string', enum: ['WIN', 'LOSE', 'PUSH', 'BLACKJACK', 'BUST'] },
                            money_change: { type: 'number' },
                            payout: { type: 'number' },
                            new_balance: { type: 'number' }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/game/hand/{hand_id}': {
        get: {
          tags: ['Game'],
          summary: 'Get hand status',
          parameters: [
            {
              in: 'path',
              name: 'hand_id',
              required: true,
              schema: { type: 'string' }
            }
          ],
          responses: {
            '200': {
              description: 'Hand status retrieved',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      hand_id: { type: 'string' },
                      status: { type: 'string' },
                      dealer_cards: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Card' }
                      },
                      dealer_value: { type: 'number', nullable: true },
                      players: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            hand_player_id: { type: 'string' },
                            player_id: { type: 'string' },
                            player_name: { type: 'string' },
                            bet_amount: { type: 'number' },
                            cards: {
                              type: 'array',
                              items: { $ref: '#/components/schemas/Card' }
                            },
                            hand_value: { type: 'number' },
                            status: { type: 'string' },
                            result: { type: 'string', nullable: true }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            '404': {
              description: 'Hand not found',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' }
                }
              }
            }
          }
        }
      }
    },
    components: {
      schemas: {
        Player: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            balance: { type: 'number' },
            total_hands_played: { type: 'number' },
            total_hands_won: { type: 'number' },
            total_hands_lost: { type: 'number' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Table: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            max_players: { type: 'number' },
            status: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'FULL'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Hand: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            table_id: { type: 'string' },
            status: { type: 'string', enum: ['WAITING', 'ACTIVE', 'DEALER_TURN', 'FINISHED'] },
            start_time: { type: 'string', format: 'date-time' },
            end_time: { type: 'string', format: 'date-time' },
            dealer_cards: { type: 'array', items: { type: 'object' } },
            dealer_hidden: { type: 'boolean' },
            player_ids: { type: 'array', items: { type: 'string' } },
          },
        },
        Card: {
          type: 'object',
          properties: {
            rank: { type: 'string', example: 'A' },
            suit: { type: 'string', example: '♠' },
            value: { type: 'number', example: 11 },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);