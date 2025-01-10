const fs = require("fs");

// JSON 파일을 읽고 파싱하는 함수
function readJsonFile(filename) {
    try {
        const data = fs.readFileSync(filename, "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.error(`파일 읽기 오류: ${filename}`, error);
        return null;
    }
}

// 두 객체를 비교하는 함수
function compareObjects(obj1, obj2) {
    const differences = {};

    // obj1의 모든 키에 대해 비교
    for (const key in obj1) {
        if (!(key in obj2)) {
            differences[key] = { type: "removed", value: obj1[key] };
        } else if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
            differences[key] = {
                type: "changed",
                oldValue: obj1[key],
                newValue: obj2[key],
            };
        }
    }

    // obj2에만 있는 키 찾기
    for (const key in obj2) {
        if (!(key in obj1)) {
            differences[key] = { type: "added", value: obj2[key] };
        }
    }

    return differences;
}

// 메인 함수
function compareJsonFiles(file1, file2) {
    const json1 = readJsonFile(file1);
    const json2 = readJsonFile(file2);

    if (!json1 || !json2) {
        return;
    }

    const differences = compareObjects(json1, json2);

    if (Object.keys(differences).length === 0) {
        console.log("두 JSON 파일은 동일합니다.");
    } else {
        console.log("두 JSON 파일의 차이점:");
        console.log(JSON.stringify(differences, null, 2));
    }
}

// 사용 예시
compareJsonFiles("./test/1.json", "./test/2.json");
