import { Component } from "react"

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props)

    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error en app interna:", error, errorInfo)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({
        hasError: false,
        error: null,
      })
    }
  }

  render() {
    if (this.state.hasError) {
      const { theme, onBack } = this.props

      return (
        <div
          style={{
            backgroundColor: theme.card,
            border: `1px solid ${theme.danger}`,
            borderRadius: "18px",
            padding: "24px",
            color: theme.text,
            textAlign: "left",
          }}
        >
          <h2 style={{ marginTop: 0, color: theme.danger }}>
            Error en esta app
          </h2>

          <p>
            Boat OS sigue funcionando, pero esta sección ha fallado.
          </p>

          <pre
            style={{
              backgroundColor: theme.cardAlt,
              border: `1px solid ${theme.border}`,
              borderRadius: "12px",
              padding: "12px",
              overflowX: "auto",
              color: theme.text,
            }}
          >
            {this.state.error?.message ?? "Error desconocido"}
          </pre>

          <button
            onClick={onBack}
            style={{
              marginTop: "14px",
              padding: "12px 18px",
              borderRadius: "12px",
              border: `1px solid ${theme.accent}`,
              backgroundColor: theme.accent,
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Volver al Dashboard
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default AppErrorBoundary