// src/components/ui/Button.jsx
export default function Button({ children, ...props }) {
  return (
    <button
      {...props}
      style={{
        background: '#222',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        padding: '8px 12px',
        cursor: 'pointer',
        marginTop: '8px',
      }}
    >
      {children}
    </button>
  );
}
