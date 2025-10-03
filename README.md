# Material-UI Example Project

A comprehensive example project showcasing Material-UI (MUI) components built with React, TypeScript, and Vite.

## 🚀 Live Demo

Visit the live demo: [https://itzmetanjim.github.io](https://itzmetanjim.github.io)

## 📋 Features

This project demonstrates the usage of various Material-UI components organized into different categories:

### 🔘 Buttons
- Basic buttons (contained, outlined, text)
- Button colors and sizes
- Icon buttons and FABs
- Button groups and toggle buttons

### 🃏 Cards
- Simple cards with content
- Cards with media and images
- Complex cards with avatars and actions
- Expandable cards with collapsible content

### 📝 Forms
- Text fields (standard, filled, outlined)
- Select dropdowns and autocomplete
- Radio groups and checkboxes
- Sliders, ratings, and switches
- Form validation and submission

### 📊 Data Display
- Tables with sorting and formatting
- Lists with avatars and icons
- Progress indicators (linear and circular)
- Badges, chips, and tooltips

### 🧭 Navigation
- Breadcrumbs navigation
- Stepper components for wizards
- Pagination controls
- Menus and bottom navigation
- Speed dial for quick actions

## 🛠️ Technology Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type safety and better developer experience
- **Material-UI (MUI) v5** - React UI component library
- **Vite** - Fast build tool and development server
- **Emotion** - CSS-in-JS library for styling

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/itzmetanjim/itzmetanjim.github.io.git
   cd itzmetanjim.github.io
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run deploy` - Deploy to GitHub Pages

## 📁 Project Structure

```
src/
├── components/           # Example components
│   ├── ButtonsExample.tsx
│   ├── CardsExample.tsx
│   ├── FormsExample.tsx
│   ├── DataDisplayExample.tsx
│   └── NavigationExample.tsx
├── App.tsx              # Main application component
└── main.tsx             # Application entry point
```

## 🎨 Customization

The project includes a custom Material-UI theme configured in `App.tsx`. You can modify:

- Color palette (primary, secondary colors)
- Typography settings
- Component default props
- Spacing and breakpoints

## 📚 Learning Resources

- [Material-UI Documentation](https://mui.com/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)

## 🚀 Deployment

This project is automatically deployed to GitHub Pages using GitHub Actions. Every push to the `main` branch triggers a new deployment.

To deploy manually:
```bash
npm run build
npm run deploy
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Material-UI Team](https://mui.com/) for the excellent component library
- [React Team](https://react.dev/) for the amazing framework
- [Vite Team](https://vitejs.dev/) for the fast build tool