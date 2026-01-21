export default function CountdownTimer() {
  return (
    <div className="countdown-timer" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '2rem 0',
      textAlign: 'center'
    }}>
      <div style={{
        fontSize: '18px',
        fontWeight: 400,
        color: '#ffffff',
        opacity: 0.8,
        textTransform: 'uppercase',
        letterSpacing: '0.1em'
      }}>
        Mission Update
      </div>
      <div style={{
        fontSize: '24px',
        fontWeight: 500,
        color: '#ffffff',
        maxWidth: '400px',
        lineHeight: 1.4
      }}>
        New launch date to be announced
      </div>
    </div>
  );
}
