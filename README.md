# Journey Canvas

A canvas-based writing assistant that reimagines how writers approach composition through spatial thinking and metacognitive support.

## Overview

Journey is a freeform canvas interface where writers can create, connect, and organize ideas spatially before generating linear documents. Unlike traditional linear document editors, Journey embraces the non-linear nature of thinking and helps writers visualize the connections between their ideas.

## Features (MVP 1)

- **Canvas-based Interface**: Unlimited freeform canvas for spatial organization of ideas
- **Multiple Node Types**:
  - **Idea**: General thoughts and concepts
  - **Claim**: Assertions and arguments
  - **Evidence**: Supporting information
  - **Question**: Open questions to explore
  - **Outline**: Structural elements
- **Visual Connections**: Link nodes to show relationships (supports, contradicts, elaborates)
- **Canvas Navigation**: Pan, zoom, and navigate large idea spaces
- **Export**: Generate linear documents in Markdown, Plain Text, or JSON
- **Auto-save**: Automatically persists your canvas to localStorage

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open your browser to the URL shown in the terminal (typically http://localhost:5173)

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Usage

### Creating Nodes

- Double-click on empty canvas space to create a node
- Select node type from the toolbar before creating
- Available types: Idea, Claim, Evidence, Question, Outline

### Manipulating Nodes

- **Move**: Click and drag a node
- **Select**: Click to select (Shift/Ctrl+Click for multi-select)
- **Delete**: Select node(s) and press Delete or Backspace
- **Edit**: Double-click a node (coming soon)

### Canvas Navigation

- **Pan**: Ctrl/Cmd+Drag or middle mouse button
- **Zoom**: Mouse wheel or use the zoom controls
- **Reset View**: Click "Reset" in the zoom controls

### Creating Connections

- Connections will be implemented in the next phase
- For now, focus on spatial organization of nodes

### Exporting

1. Click the "Export" button in the toolbar
2. Select your preferred format (Markdown, Plain Text, or JSON)
3. Click "Generate Export"
4. Copy to clipboard or download the file

## Keyboard Shortcuts

- `Delete` / `Backspace`: Delete selected nodes
- `Escape`: Deselect all nodes
- `Ctrl/Cmd + Drag`: Pan canvas

## Tech Stack

- **React 18** with TypeScript
- **Konva.js** with react-konva for canvas rendering
- **Zustand** for state management
- **Tailwind CSS** for styling
- **Vite** for fast development and building

## Project Structure

```
src/
├── components/
│   ├── Canvas/           # Canvas and node components
│   ├── UI/               # Toolbar and export components
│   └── Layout/           # App layout
├── stores/               # Zustand state management
├── utils/                # Helper functions and document generation
└── types/                # TypeScript type definitions
```

## Future Roadmap

### MVP 2: Basic AI Analysis
- Pattern detection (isolated nodes, weak connections)
- Basic question generation based on canvas structure
- Non-intrusive suggestion system

### MVP 3: Metacognitive Coaching
- Context-aware question generation
- Intervention timing based on user behavior
- Learning from user responses

### MVP 4: Advanced Features
- Collaborative canvas editing
- Template systems
- Advanced export options
- Integration with external tools

## License

MIT