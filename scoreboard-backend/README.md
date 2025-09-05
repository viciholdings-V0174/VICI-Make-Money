# Scoreboard Backend

This project implements a WebSocket server for managing a scoreboard system. It allows users to upload their scores along with their usernames and query the rankings.

## Project Structure

```
scoreboard-backend
├── src
│   ├── main.py          # Main entry point of the application
│   └── types
│       └── index.py     # Defines data types and structures
├── requirements.txt      # Lists required Python packages
└── README.md             # Project documentation
```

## Installation

To set up the project, ensure you have Python installed. Then, install the required packages using:

```
pip install -r requirements.txt
```

## Running the Server

To start the WebSocket server, run the following command:

```
python src/main.py
```

## API Endpoints

### Upload Score

- **Endpoint**: `ws://<server_address>/upload`
- **Method**: WebSocket message
- **Payload**: 
  ```json
  {
    "username": "string",
    "score": "integer"
  }
  ```

### Query Rankings

- **Endpoint**: `ws://<server_address>/rankings`
- **Method**: WebSocket message
- **Payload**: 
  ```json
  {
    "action": "get_rankings"
  }
  ```
- **Response**: 
  ```json
  {
    "rankings": [
      {
        "username": "string",
        "score": "integer"
      }
    ]
  }
  ```

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes.