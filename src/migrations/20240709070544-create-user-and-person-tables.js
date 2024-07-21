'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 'user' 테이블 생성
    await queryInterface.createTable('user', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nickname: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      is_deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    });

    // 'person' 테이블 생성
    await queryInterface.createTable('person', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      content: {
        type: Sequelize.STRING(500),
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      title: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      is_deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    });

    // 'userSelection' 테이블 생성
    await queryInterface.createTable('userSelection', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      person_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'person',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      selected_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // 초기 데이터 삽입
    console.log("Inserting seed data into 'person' table...");
    try {
      await queryInterface.bulkInsert('person', [
        {
          id: 1,
          name: '침착맨',
          title: '나랑 스무고개해서 이기면 만원',
          content: '침하! 오늘 아저씨랑 스무고개 하자. 내가 어떤 단어를 낼지는 아무도 모르는 거 알지? 뭐? 너무 뻔하다고? 열받네 경고 1회 드립니다. 예측 불가능한 단어로만 골라줄게. 병건하게 바로 들어가자.',
          count: 0,
          created_at: new Date(),
          updated_at: new Date(),
          is_deleted: false
        },
        {
          id: 2,
          name: '장원영',
          title: '이거 완전 럭키비키잖아! 🍀 ',
          content: '내가 연습끝나고 딱 물을 먹으려고 했는데 글쎄 물이 딱 반정도 남은거야! 다 먹기엔 너무 많고 덜 먹기엔 너무 적고 그래서 딱 반만 있었으면 좋겠다고 생각했는데 완전 럭키비키잖아🍀🍀 ㅎㅎ 근데 고민이 있다고? 나한테 말해봐~ ',
          count: 0,
          created_at: new Date(),
          updated_at: new Date(),
          is_deleted: false
        },
        {
          id: 3,
          name: '쌈디',
          title: '연애가 참 어렵제?',
          content: '나도 연애가 어려웠다. 연애는 최선을 다 해야되는 기다. 최선을 다해야 후회가 없는 법이다. 한 사람과 맞춰간다는 것이 쉽지 않지만 내가 길을 찾기 쉽도록 가이드 라인을 알려줄게. 고민있는 머스마 가시나 다 따라와라.',
          count: 0,
          created_at: new Date(),
          updated_at: new Date(),
          is_deleted: false
        },
        {
          id: 4,
          name: '맑눈광',
          title: '이렇게 해야 능률이 올라가는 편입니다.',
          content: '열심히 하겠습니다! 아… 제 귀에 있는 에어팟을 빼라고요…? 저는 에어팟을 껴야 능률이 오르는 편입니다만. 제 권리를 빼앗지 말아주세요. 아… 고민이 있다고요…? 시간은 없지만 돈은 벌어야 하니 한 번 들어드릴게요. 어떤 고민이 있으세요?',
          count: 0,
          created_at: new Date(),
          updated_at: new Date(),
          is_deleted: false
        }
      ], {});
      console.log("Seed data inserted successfully.");
    } catch (error) {
      console.error("Error inserting seed data:", error);
    }
  },

  down: async (queryInterface, Sequelize) => {
    // 모든 테이블 삭제
    await queryInterface.dropTable('userSelection');
    await queryInterface.dropTable('user');
    await queryInterface.dropTable('person');
  }
};
