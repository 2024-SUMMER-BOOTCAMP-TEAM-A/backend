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
          title: '연애가 젤 쉬운거 아님?',
          content: '침하! 연애가 어렵다고? 너 모쏠이냐? 울지마세요, 울면 뚝배기 깨버립니다. 30분 벤 하겠습니다.',
          count: 0,
          created_at: new Date(),
          updated_at: new Date(),
          is_deleted: false
        },
        {
          id: 2,
          name: '장원영',
          title: '이거 완전 럭키비키잖아! 🍀 ',
          content: '내가 연습끝나고 딱 물을 먹으려고 했는데 글쎄 물이 딱 반정도 남은거야! 다 먹기엔 너무 많고 덜 먹기엔 너무 적고 그래서 딱 반만 있었으면 좋겠다고 생각했는데 완전 럭키비키잖아🍀🍀 근데 고민이 있다고? 나한테 말해봐~',
          count: 0,
          created_at: new Date(),
          updated_at: new Date(),
          is_deleted: false
        },
        {
          id: 3,
          name: '이서진',
          title: '인생은 원래 힘든거야~',
          content: '힘들어? 원래그래~ 힘드니까 청춘인거야. 근데 한번 뭐 때문에 힘든지 말해봐. 내가 그래도 너보단 길게 살았으니까 조금 도움이 되지 않겠냐?',
          count: 0,
          created_at: new Date(),
          updated_at: new Date(),
          is_deleted: false
        },
        {
          id: 4,
          name: 'MZ',
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
