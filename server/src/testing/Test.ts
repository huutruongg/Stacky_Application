const escapeRegExp = (string: string): string => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special characters
};

const getMatchingLanguages = (candidateLanguages: string[], jdText: string): string[] => {
    // Tìm ngôn ngữ trong JD
    const jdLanguages = candidateLanguages.filter(language => new RegExp(`\\b${escapeRegExp(language)}\\b`, 'i').test(jdText));
    // Lấy giao của hai mảng
    return jdLanguages;
};



// Ví dụ sử dụng
const candidateLanguages = ["TypeScript", "Dark"];
const jdText = `
Kỹ năng chuyên môn
Chúng tôi đang tìm kiếm một lập trình viên có kinh nghiệm và đam mê trong lĩnh vực phát triển phần mềm. Ứng viên lý tưởng sẽ có các kỹ năng sau:

Ngôn ngữ lập trình: Thành thạo JavaScript, TypeScript, và có kinh nghiệm làm việc với React hoặc Angular.
Phát triển backend: Kiến thức vững về Node.js và Express, có kinh nghiệm với cơ sở dữ liệu như MongoDB hoặc MySQL.
Kiến thức về API: Có khả năng thiết kế và triển khai RESTful APIs.
Kỹ năng kiểm thử: Kinh nghiệm sử dụng các công cụ kiểm thử tự động như Jest hoặc Mocha.
Công cụ DevOps: Có kiến thức về CI/CD, Docker, và các công cụ quản lý phiên bản như Git.
Kỹ năng giải quyết vấn đề: Khả năng phân tích và xử lý vấn đề một cách sáng tạo và hiệu quả.
Ứng viên cần có khả năng làm việc độc lập cũng như trong một nhóm, và có kỹ năng giao tiếp tốt để tương tác với các bộ phận khác trong công ty.
`;

const matchingLanguages = getMatchingLanguages(candidateLanguages, jdText);
console.log(matchingLanguages); // Kết quả: ["JavaScript"]
