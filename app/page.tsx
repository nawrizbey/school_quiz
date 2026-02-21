import { useState, useEffect } from "react";

const FloatingOrb = ({ size, color, top, left, delay }: { size: string; color: string; top: string; left: string; delay: number }) => (
  <div
    style={{
      position: "absolute",
      width: size,
      height: size,
      borderRadius: "50%",
      background: color,
      top,
      left,
      filter: "blur(60px)",
      opacity: 0.35,
      animation: `float ${3 + delay}s ease-in-out infinite alternate`,
      animationDelay: `${delay}s`,
    }}
  />
);

const FeatureCard = ({ icon, title, desc, delay }: { icon: string; title: string; desc: string; delay: string }) => (
  <div
    style={{
      background: "rgba(255,255,255,0.07)",
      border: "1px solid rgba(255,255,255,0.15)",
      borderRadius: "20px",
      padding: "28px 24px",
      backdropFilter: "blur(12px)",
      animation: `slideUp 0.6s ease forwards`,
      animationDelay: delay,
      opacity: 0,
      transform: "translateY(30px)",
    }}
  >
    <div style={{ fontSize: "40px", marginBottom: "14px" }}>{icon}</div>
    <h3 style={{ color: "#fff", fontSize: "18px", fontWeight: 700, marginBottom: "8px", fontFamily: "'Nunito', sans-serif" }}>{title}</h3>
    <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "14px", lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>{desc}</p>
  </div>
);

const StatBadge = ({ value, label }: { value: string; label: string }) => (
  <div style={{ textAlign: "center" }}>
    <div style={{ fontSize: "32px", fontWeight: 900, color: "#fff", fontFamily: "'Nunito', sans-serif", lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", marginTop: "4px", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.5px" }}>{label}</div>
  </div>
);

export default function LingaPlayLanding() {
  const [downloaded, setDownloaded] = useState(false);
  const [particles, setParticles] = useState<{id: number; x: number; y: number; size: number; delay: number; speed: number}[]>([]);

  useEffect(() => {
    const p = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 3,
      delay: Math.random() * 4,
      speed: Math.random() * 3 + 2,
    }));
    setParticles(p);
  }, []);

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=DM+Sans:wght@400;500;600&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        @keyframes float {
          from { transform: translateY(0px) scale(1); }
          to   { transform: translateY(-30px) scale(1.05); }
        }
        @keyframes slideUp {
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(99,213,138,0.4); }
          50% { transform: scale(1.03); box-shadow: 0 0 0 18px rgba(99,213,138,0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes particleDrift {
          0%   { transform: translateY(0) rotate(0deg); opacity: 0.6; }
          100% { transform: translateY(-120vh) rotate(360deg); opacity: 0; }
        }
        @keyframes logoFloat {
          0%, 100% { transform: translateY(0px) rotate(-3deg); }
          50% { transform: translateY(-12px) rotate(3deg); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .btn-download {
          display: flex; align-items: center; justify-content: center; gap: 12px;
          background: linear-gradient(135deg, #63d58a, #3ec878);
          color: #0a1f14;
          font-family: 'Nunito', sans-serif;
          font-size: 18px; font-weight: 900;
          padding: 20px 48px;
          border-radius: 100px;
          border: none; cursor: pointer;
          animation: pulse 2.5s infinite;
          transition: all 0.3s;
          width: 100%; max-width: 360px;
          letter-spacing: 0.3px;
          position: relative;
          overflow: hidden;
        }
        .btn-download::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        .btn-download:hover { transform: scale(1.05) !important; filter: brightness(1.1); }
        .btn-download.done {
          background: linear-gradient(135deg, #4fc3f7, #0288d1);
          animation: none;
        }

        .screen-mockup {
          animation: logoFloat 4s ease-in-out infinite;
        }

        html, body { height: 100%; }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #0b0f2a 0%, #0f1e3c 40%, #0d2b1f 100%)",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'DM Sans', sans-serif",
      }}>

        {/* Background orbs */}
        <FloatingOrb size="500px" color="#4f46e5" top="-150px" left="-100px" delay={0} />
        <FloatingOrb size="400px" color="#16a34a" top="30%" left="60%" delay={1.5} />
        <FloatingOrb size="350px" color="#7c3aed" top="70%" left="-80px" delay={0.8} />
        <FloatingOrb size="300px" color="#0ea5e9" top="10%" left="70%" delay={2} />

        {/* Floating particles */}
        {particles.map(p => (
          <div key={p.id} style={{
            position: "absolute",
            left: `${p.x}%`,
            bottom: 0,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.6)",
            animation: `particleDrift ${p.speed + 4}s linear infinite`,
            animationDelay: `${p.delay}s`,
          }} />
        ))}

        <div style={{
          position: "relative", zIndex: 10,
          maxWidth: "480px",
          margin: "0 auto",
          padding: "0 20px 60px",
          animation: "fadeIn 0.8s ease forwards",
        }}>

          {/* Top bar */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "20px 0",
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: "8px",
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: "10px",
                background: "linear-gradient(135deg, #63d58a, #4f46e5)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "18px",
              }}>🎓</div>
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px", fontFamily: "'Nunito', sans-serif", fontWeight: 600 }}>
                Specialized School Chimbay
              </span>
            </div>
            <div style={{
              background: "rgba(99,213,138,0.15)",
              border: "1px solid rgba(99,213,138,0.4)",
              borderRadius: "100px",
              padding: "5px 14px",
              fontSize: "12px", color: "#63d58a",
              fontWeight: 600, fontFamily: "'Nunito', sans-serif",
            }}>
              ● LIVE
            </div>
          </div>

          {/* Hero App Icon */}
          <div style={{ textAlign: "center", padding: "32px 0 20px" }}>
            <div className="screen-mockup" style={{
              display: "inline-flex", flexDirection: "column", alignItems: "center",
              background: "linear-gradient(145deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))",
              border: "1.5px solid rgba(255,255,255,0.2)",
              borderRadius: "32px",
              padding: "24px 28px 20px",
              backdropFilter: "blur(20px)",
              boxShadow: "0 30px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}>
              {/* Fake phone screen */}
              <div style={{
                width: 160, height: 280,
                background: "linear-gradient(180deg, #1a2744 0%, #0f1a2e 100%)",
                borderRadius: "24px",
                border: "3px solid rgba(255,255,255,0.1)",
                overflow: "hidden",
                position: "relative",
                boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
              }}>
                {/* Status bar */}
                <div style={{ background: "#0d1524", height: "22px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px" }}>
                  <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.6)", fontFamily: "monospace" }}>9:41</span>
                  <div style={{ display: "flex", gap: "4px" }}>
                    {[4,6,8,10].map(h => <div key={h} style={{ width: 3, height: h, background: "rgba(255,255,255,0.5)", borderRadius: 2 }} />)}
                  </div>
                </div>
                {/* App header */}
                <div style={{ padding: "14px 14px 8px", background: "linear-gradient(180deg, #1e3a5f, transparent)" }}>
                  <div style={{ fontSize: "13px", fontWeight: 800, color: "#63d58a", fontFamily: "'Nunito', sans-serif" }}>LingaPlay</div>
                  <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.5)", marginTop: 2 }}>Today's Quiz →</div>
                </div>
                {/* Question card */}
                <div style={{ margin: "8px 10px", background: "rgba(99,213,138,0.12)", borderRadius: "12px", padding: "10px", border: "1px solid rgba(99,213,138,0.25)" }}>
                  <div style={{ fontSize: "9px", color: "#63d58a", fontWeight: 700, marginBottom: 6 }}>VOCABULARY</div>
                  <div style={{ fontSize: "11px", color: "#fff", fontWeight: 600, marginBottom: 8 }}>What does "serendipity" mean?</div>
                  {["Happy accident ✓", "Sadness", "Confusion"].map((opt, i) => (
                    <div key={i} style={{
                      background: i === 0 ? "rgba(99,213,138,0.3)" : "rgba(255,255,255,0.06)",
                      border: `1px solid ${i === 0 ? "rgba(99,213,138,0.5)" : "rgba(255,255,255,0.1)"}`,
                      borderRadius: "8px", padding: "5px 8px",
                      fontSize: "9px", color: i === 0 ? "#63d58a" : "rgba(255,255,255,0.6)",
                      marginBottom: 4, fontWeight: i === 0 ? 700 : 400,
                    }}>{opt}</div>
                  ))}
                </div>
                {/* Score bar */}
                <div style={{ margin: "6px 10px", display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ width: "72%", height: "100%", background: "linear-gradient(90deg, #63d58a, #4f46e5)", borderRadius: 4 }} />
                  </div>
                  <span style={{ fontSize: "9px", color: "#63d58a", fontWeight: 700 }}>72%</span>
                </div>
                {/* Bottom nav */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "#0d1524", height: 36, display: "flex", justifyContent: "space-around", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                  {["🏠", "📚", "🏆", "👤"].map((ic, i) => (
                    <div key={i} style={{ fontSize: i === 0 ? "14px" : "12px", opacity: i === 0 ? 1 : 0.4 }}>{ic}</div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 16, textAlign: "center" }}>
                <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif" }}>AVAILABLE NOW</div>
                <div style={{ display: "flex", gap: 6, marginTop: 6, justifyContent: "center" }}>
                  {["Android", "iOS"].map(p => (
                    <span key={p} style={{
                      background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: "6px", padding: "3px 10px", fontSize: "10px", color: "rgba(255,255,255,0.7)",
                      fontFamily: "'Nunito', sans-serif", fontWeight: 600,
                    }}>{p}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main headline */}
          <div style={{ textAlign: "center", padding: "28px 0 0" }}>
            <div style={{
              display: "inline-block",
              background: "linear-gradient(135deg, rgba(99,213,138,0.15), rgba(79,70,229,0.15))",
              border: "1px solid rgba(99,213,138,0.3)",
              borderRadius: "100px", padding: "6px 20px",
              fontSize: "12px", color: "#63d58a",
              fontFamily: "'Nunito', sans-serif", fontWeight: 700,
              letterSpacing: "1px", marginBottom: "20px",
            }}>
              🌍 LANGUAGE LEARNING APP
            </div>

            <h1 style={{
              fontSize: "clamp(38px, 9vw, 52px)",
              fontWeight: 900,
              fontFamily: "'Nunito', sans-serif",
              lineHeight: 1.1,
              letterSpacing: "-1px",
              background: "linear-gradient(135deg, #ffffff 0%, #a5b4fc 50%, #63d58a 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: "18px",
            }}>
              Learn Languages,<br />Play & Win! 🎯
            </h1>

            <p style={{
              color: "rgba(255,255,255,0.65)",
              fontSize: "16px",
              lineHeight: 1.7,
              fontFamily: "'DM Sans', sans-serif",
              maxWidth: "360px",
              margin: "0 auto 32px",
            }}>
              The fun quiz app made for students of <strong style={{ color: "rgba(255,255,255,0.9)" }}>Specialized School Chimbay</strong>. Master English vocabulary, grammar, and more — one game at a time.
            </p>

            {/* Stats */}
            <div style={{
              display: "flex", justifyContent: "center", gap: "40px",
              padding: "20px",
              background: "rgba(255,255,255,0.04)",
              borderRadius: "20px",
              border: "1px solid rgba(255,255,255,0.08)",
              marginBottom: "36px",
            }}>
              <StatBadge value="500+" label="Students" />
              <div style={{ width: 1, background: "rgba(255,255,255,0.1)" }} />
              <StatBadge value="1.2K" label="Questions" />
              <div style={{ width: 1, background: "rgba(255,255,255,0.1)" }} />
              <StatBadge value="4.9★" label="Rating" />
            </div>

            {/* Download button */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
              <button className={`btn-download ${downloaded ? "done" : ""}`} onClick={handleDownload}>
                {downloaded ? (
                  <><span style={{ fontSize: "22px" }}>✅</span> Download Started!</>
                ) : (
                  <><span style={{ fontSize: "22px" }}>📲</span> Download LingaPlay</>
                )}
              </button>
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif" }}>
                Free • No ads • 14 MB • Android & iOS
              </span>
            </div>
          </div>

          {/* Features */}
          <div style={{ marginTop: "52px" }}>
            <h2 style={{
              fontSize: "22px", fontWeight: 800,
              color: "rgba(255,255,255,0.9)",
              fontFamily: "'Nunito', sans-serif",
              textAlign: "center", marginBottom: "24px",
              letterSpacing: "-0.5px",
            }}>Why students love it</h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <FeatureCard icon="⚡" title="Fast Quizzes" desc="Quick 60-second rounds to keep you sharp and engaged every day." delay="0.1s" />
              <FeatureCard icon="🏆" title="Leaderboard" desc="Compete with classmates and claim the top spot each week." delay="0.2s" />
              <FeatureCard icon="📖" title="Full Curriculum" desc="Aligned with your school syllabus — vocab, grammar & reading." delay="0.3s" />
              <FeatureCard icon="📊" title="Track Progress" desc="Visual stats show exactly how far you've come over time." delay="0.4s" />
            </div>
          </div>

          {/* Teacher section */}
          <div style={{
            marginTop: "40px",
            background: "linear-gradient(135deg, rgba(79,70,229,0.2), rgba(99,213,138,0.1))",
            border: "1px solid rgba(79,70,229,0.35)",
            borderRadius: "24px",
            padding: "28px 24px",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>👩‍🏫</div>
            <h3 style={{ color: "#fff", fontSize: "18px", fontWeight: 800, fontFamily: "'Nunito', sans-serif", marginBottom: "10px" }}>For Teachers</h3>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif", marginBottom: "20px" }}>
              Create custom quizzes, monitor student performance, and manage your classroom — all from one admin panel.
            </p>
            <button style={{
              background: "rgba(79,70,229,0.3)", border: "1px solid rgba(79,70,229,0.5)",
              color: "#a5b4fc", padding: "12px 28px", borderRadius: "12px",
              fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: "14px",
              cursor: "pointer", transition: "all 0.3s",
            }}
            >
              Open Teacher Dashboard →
            </button>
          </div>

          {/* Testimonial */}
          <div style={{
            marginTop: "28px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "20px",
            padding: "24px",
          }}>
            <div style={{ fontSize: "24px", color: "#63d58a", fontFamily: "'Nunito', sans-serif", fontWeight: 900, lineHeight: 1, marginBottom: "12px" }}>"</div>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "14px", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif", fontStyle: "italic" }}>
              LingaPlay made learning English actually fun. I went from struggling with vocabulary to topping my class in just two months!
            </p>
            <div style={{ marginTop: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: 38, height: 38, borderRadius: "50%",
                background: "linear-gradient(135deg, #63d58a, #4f46e5)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "18px",
              }}>👦</div>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#fff", fontFamily: "'Nunito', sans-serif" }}>Alisher M.</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)", fontFamily: "'DM Sans', sans-serif" }}>Grade 9, Specialized School Chimbay</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            marginTop: "48px", textAlign: "center",
            paddingTop: "28px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}>
            <div style={{ fontSize: "28px", marginBottom: "10px" }}>🎓</div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", fontFamily: "'Nunito', sans-serif", fontWeight: 700, marginBottom: "4px" }}>
              Specialized School Chimbay
            </div>
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px", fontFamily: "'DM Sans', sans-serif", marginBottom: "20px" }}>
              Chimbay, Karakalpakstan, Uzbekistan
            </div>
            <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
              {["Privacy Policy", "Contact", "Support"].map(link => (
                <a key={link} href="#" style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px", fontFamily: "'DM Sans', sans-serif", textDecoration: "none" }}>{link}</a>
              ))}
            </div>
            <div style={{ marginTop: "24px", color: "rgba(255,255,255,0.2)", fontSize: "11px", fontFamily: "'DM Sans', sans-serif" }}>
              © 2025 LingaPlay · Specialized School Chimbay. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
