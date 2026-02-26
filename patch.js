const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/src/modules/employer/pages/PostJob.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const injection1 = `
  const handlePost20DummyJobs = async () => {
    setLoading(true);
    try {
      for (let i = 1; i <= 20; i++) {
        const titleText = \`abc \${String(i).padStart(2, '0')}\`;
        await jobService.createJob({
          title: titleText,
          category: "Development",
          type: "Full-time",
          location: "Remote",
          salary: "10 - 20 LPA",
          minSalary: 10,
          maxSalary: 20,
          experience: 2,
          vacancies: 5,
          description: \`This is a dummy job description for \${titleText}. The description needs to be at least 10 characters long.\`,
          requirements: ["React", "TypeScript", "Node.js"],
          responsibilities: [],
        });
      }
      alert("Successfully posted 20 dummy jobs!");
    } catch (error) {
      console.error("Failed to post 20 dummy jobs", error);
      alert("Failed to post 20 dummy jobs.");
    } finally {
      setLoading(false);
    }
  };

  if (step === 3) {`;

content = content.replace('  if (step === 3) {', injection1);

const injection2 = `        <div className="size-11" /> {/* Spacer */}
      </div>

      <div className="px-5 mt-4">
        <button
          type="button"
          disabled={loading}
          onClick={handlePost20DummyJobs}
          className="h-12 w-full rounded-2xl bg-amber-500 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-amber-500/20 active:scale-95 transition-all"
        >
          {loading ? "Posting..." : "Post 20 Dummy Jobs"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-8">`;

content = content.replace('        <div className="size-11" /> {/* Spacer */}\r\n      </div>\r\n\r\n      <form onSubmit={handleSubmit} className="mt-6 space-y-8">', injection2);
// in case of LF instead of CRLF
content = content.replace('        <div className="size-11" /> {/* Spacer */}\n      </div>\n\n      <form onSubmit={handleSubmit} className="mt-6 space-y-8">', injection2);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Patched PostJob.tsx');
