package config

type Secret struct {
	Type  string `yaml:"type"`
	Value string `yaml:"value"`
}

type Server struct {
	Debug    bool     `yaml:"debug"`
	Secrets  []Secret `yaml:"secret"`
	Database string   `yaml:"database"`
}
